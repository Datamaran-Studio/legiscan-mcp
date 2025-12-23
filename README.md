# LegiScan MCP Server

A Model Context Protocol (MCP) server that provides access to the [LegiScan API](https://legiscan.com/) for legislative data from all 50 US states.

## Features

- **18 MCP Tools** covering all LegiScan API operations
- Full TypeScript type definitions for all API responses
- Comprehensive bill, vote, and legislator data access
- Full-text search across legislation
- GAITS bill monitoring support

## Setup

### 1. Get a LegiScan API Key

1. Create a free account at [LegiScan](https://legiscan.com/)
2. Register for API access at https://legiscan.com/legiscan
3. Copy your API key

### 2. Install Dependencies

```bash
cd legiscan-mcp-server
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env and add your API key
```

### 4. Build

```bash
npm run build
```

### 5. Add to Claude Code

Add to your Claude Code MCP configuration (`~/.claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "legiscan": {
      "command": "node",
      "args": ["/path/to/legiscan-mcp-server/dist/index.js"],
      "env": {
        "LEGISCAN_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Available Tools

### Sessions
| Tool | Description |
|------|-------------|
| `legiscan_get_session_list` | List available legislative sessions by state |

### Bills
| Tool | Description |
|------|-------------|
| `legiscan_get_master_list` | Get all bills in a session |
| `legiscan_get_master_list_raw` | Get bill IDs with change hashes (efficient sync) |
| `legiscan_get_bill` | Get detailed bill info (sponsors, history, votes, texts) |
| `legiscan_get_bill_text` | Get bill text document (base64) |
| `legiscan_get_amendment` | Get amendment document (base64) |
| `legiscan_get_supplement` | Get supplemental docs (fiscal notes, veto letters) |
| `legiscan_get_roll_call` | Get vote details with individual legislator votes |

### People
| Tool | Description |
|------|-------------|
| `legiscan_get_person` | Get legislator info with third-party IDs |
| `legiscan_get_session_people` | Get all legislators active in a session |
| `legiscan_get_sponsored_list` | Get bills sponsored by a legislator |

### Search
| Tool | Description |
|------|-------------|
| `legiscan_search` | Full-text search (50 results/page) |
| `legiscan_search_raw` | Full-text search (2000 results/page) |

### Datasets
| Tool | Description |
|------|-------------|
| `legiscan_get_dataset_list` | List available bulk datasets |
| `legiscan_get_dataset` | Download dataset ZIP archive |

### Monitor (GAITS)
| Tool | Description |
|------|-------------|
| `legiscan_get_monitor_list` | Get tracked bills |
| `legiscan_get_monitor_list_raw` | Get tracked bills (minimal data) |
| `legiscan_set_monitor` | Add/remove bills from monitor list |

## Usage Examples

### Search for bills about climate change in California
```
Use legiscan_search with query="climate change" state="CA"
```

### Get detailed information about a specific bill
```
Use legiscan_get_bill with bill_id=1234567
```

### Find all legislators in Texas 2023 session
```
1. Use legiscan_get_session_list with state="TX"
2. Use legiscan_get_session_people with the session_id
```

### Track how a legislator voted
```
1. Get bill with legiscan_get_bill
2. Get roll call with legiscan_get_roll_call using roll_call_id from bill.votes[]
3. Find legislator's vote in the votes[] array by people_id
```

## API Limits

- Free public API keys have a **30,000 queries per month** limit
- Respect rate limits: avoid polling more frequently than the recommended intervals
- Use `*_raw` variants for efficient change detection

## License

MIT
