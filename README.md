# Redshift Service

## Env

See [env.json](./env.json).

## Listen Port

http://localhost:3000

## How to use

use a post request like
```
const url = 'http://localhost:3000/campaign/23842799522980215'
const body = {
  "startTime": "2018-04-19 00:00:00",
  "endTime": "2018-04-19 09:00:00"
}
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
}).then(res => {})
```

