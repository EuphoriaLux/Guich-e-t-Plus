import asyncio
import aiohttp
from bs4 import BeautifulSoup
import json
import random
from tqdm.asyncio import tqdm
import os

# ANSI escape codes for colors
class LogColors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

# Custom log functions to include color
def info_log(message):
    print(f"{LogColors.BLUE}[INFO]{LogColors.ENDC} {message}")

def success_log(message):
    print(f"{LogColors.GREEN}[SUCCESS]{LogColors.ENDC} {message}")

def warning_log(message):
    print(f"{LogColors.WARNING}[WARNING]{LogColors.ENDC} {message}")

def error_log(message):
    print(f"{LogColors.FAIL}[ERROR]{LogColors.ENDC} {message}")

# Load the JSON file
file_path = 'fr_links_entreprise.json'
with open(file_path, 'r') as file:
    json_data = json.load(file)

info_log(f"Loaded {len(json_data)} items from the JSON file.")


def get_random_delay(min_delay, max_delay):
    return random.uniform(min_delay, max_delay)

# Define the element selector to find the 'article' tag with role attribute 'article'
element_selector = 'article[role="article"]'

# Semaphore to control the number of concurrent requests
concurrent_requests = 40
semaphore = asyncio.Semaphore(concurrent_requests)


# List of user agents to rotate
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0",
]

async def fetch_with_retry(url, session, retries=3, backoff_factor=0.3):
    retry_delays = [backoff_factor + random.uniform(0, 0.2) for _ in range(retries)]  # Introduce jitter
    for delay in retry_delays:
        try:
            # Rotate user agent
            headers = {"User-Agent": random.choice(USER_AGENTS)}
            async with session.get(url, headers=headers, timeout=10) as response:
                response.raise_for_status()
                return await response.text()
        except (aiohttp.ClientError, asyncio.TimeoutError) as e:
            await asyncio.sleep(delay)
    raise aiohttp.ClientError(f"Request failed for {url} after {retries} retries")


async def fetch_and_update(item, session):
    # Introduce a delay before each request
    await asyncio.sleep(random.uniform(0.1, 0.8))
    url = item['Link']
    async with semaphore:
        try:
            content = await fetch_with_retry(url, session)
            soup = BeautifulSoup(content, 'html.parser')
            element = soup.select_one(element_selector)
            element_found = bool(element)
            item['SpecificElementExists'] = element_found
            if element_found:
                success_log(f"Element found for URL: {url}")
            else:
                warning_log(f"Element not found for URL: {url}")
            return item
        except aiohttp.ClientError as e:
            error_log(f"Request ultimately failed for {url}: {e}")
            return None

state_file_path = 'state_fr_links_entreprise.json'

async def process_all(json_data, state_file_path):
    # Check if state file exists and load it
    if os.path.exists(state_file_path):
        with open(state_file_path, 'r') as state_file:
            state = json.load(state_file)
            start_index = state.get('last_index', 0)
            json_data = state.get('json_data', json_data)
            info_log(f"Resuming from index {start_index}.")
    else:
        start_index = 0

    async with aiohttp.ClientSession(headers={"User-Agent": "Mozilla/5.0"}) as session:
        progress_bar = tqdm(total=len(json_data), desc="Processing URLs", unit="url")
        progress_bar.update(start_index)  # Update progress bar to reflect the starting point
        results = json_data[:start_index]  # Presume that items before start_index have already been processed

        for index in range(start_index, len(json_data)):
            item = json_data[index]
            result = await fetch_and_update(item, session)
            progress_bar.update(1)
            results.append(result)

            # Save state every 10 items or at the end
            if index % 10 == 0 or index == len(json_data) - 1:
                with open(state_file_path, 'w') as state_file:
                    state = {
                        'last_index': index + 1,
                        'json_data': results
                    }
                    json.dump(state, state_file, indent=4)
                    info_log(f"State saved at index {index}.")

        progress_bar.close()
        return [item for item in results if item is not None]


# Run the async process
updated_json_data = asyncio.run(process_all(json_data, state_file_path))