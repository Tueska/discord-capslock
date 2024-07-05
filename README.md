# Capslock Hunter

## Overview

Capslock Hunter is a simple yet effective tool to help manage and moderate excessive caps lock usage in your Discord server. The bot automatically sends a warning via a reaction when a user uses too much caps lock. If the user sends another message within the grace period, the bot will convert the entire message to lowercase using a "fake user" via Webhooks in the channel.
|Discord Chat Menu|Bot in Chat|
|------|---------|
|![Discord Chat Menu](https://tue.sk/2Ya0rx)|![Bot in Action](https://tue.sk/oMMnYc)|

## Features

- **Caps Lock Warning:** Automatically adds a warning reaction to messages with excessive caps lock.
- **Message Lowercasing:** Converts messages to lowercase if another message with caps lock is sent within a configurable grace period.
- **Configurable Settings:** Customize the caps lock threshold and grace period to suit your server's needs.

## Getting Started

### Adding the Bot to Your Server

You can add the Capslock Hunter Bot to your server by clicking [here](https://tue.sk/discord-capslockbot).

### Configuration

After adding the bot, you can configure the caps lock threshold and grace period using the bot's commands.

### Requirements

- A Discord server
- Administrative permissions to add and configure the bot

## Installation

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/Tueska/discord-capslock.git
    cd discord-capslock
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

3. **Configure Environment Variables:**
    Create a `.env` file in the root directory and add your Discord bot token:
    ```plaintext
    DISCORD_TOKEN=your_discord_bot_token
    ```

4. **Run the Bot:**
    ```bash
    npm start
    ```

## Usage

Once the bot is added to your server and running, it will start monitoring for excessive caps lock usage. You can adjust the settings as needed using the bot's commands.

### Commands

- **Set Caps Lock Threshold:**
    ```plaintext
    /threshold <number>
    ```
    Set the percentage of caps lock usage (in percent) that triggers a warning.

- **Set Grace Period:**
    ```plaintext
    /grace <minutes>
    ```
    Set the time period (in minutes) within which another message with caps lock will trigger message lowercasing.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any bug fixes, features, or enhancements.

## Contact

If you have any questions or need further assistance, feel free to open an issue on GitHub.
