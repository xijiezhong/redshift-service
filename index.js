require('checkenv').check()
const pg = require('pg')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const redshiftUrl = process.env.REDSHIFT_URL
const redshift = new pg.Client(redshiftUrl)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.post('/campaign/:campaignId', async (req, res) => {
  await redshift.connect()

  const campaignId = req.params.campaignId
  const {startTime, endTime} = req.body

  const query = composeQuery(campaignId, startTime, endTime)
  const result = await redshift.query(query)

  if (result.rows.length === 0) {
    res.josn({income: 0})
  } else {
    res.json({income: result.rows[0].pay_price})
  }
})

const composeQuery = (campaignId, startTime, endTime) => {
  return `
   SELECT
       C.campaign_id
       ,sum(cast(json_extract_path_text(event_value, 'af_revenue') as float))  pay_price
   FROM dw.appsflyer_event A
   inner join (
       select distinct campaign_id
       from dim.fb_campaign_v3
       where  account_id in ('2035998863338806','1011069052408253')
       ) C on A.fb_campaign_id = C.campaign_id
   WHERE event_time between '${startTime}' and '${endTime}'
     AND C.campaign_id = '${campaignId}'
     AND event_name='af_purchase'
     AND event_value <> ''
   GROUP BY 1 `
}

app.listen(3000, () => {
  console.log('app listening on port 3000!')
})

