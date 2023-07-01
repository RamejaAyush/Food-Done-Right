require('dotenv').config()

const PORT = process.env.PORT || 8080
import fs from 'fs'
import path from 'path'
import cors from 'cors'
import xml2js from 'xml2js'
import express, { Express, Request, Response } from 'express'

const app: Express = express()

app.use(cors())
app.use(express.json())

app.get('/getData', (req: Request, res: Response) => {
  fs.readFile('./Assets/asset.kml', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: err })
    }

    xml2js.parseString(data, (err, result) => {
      if (err) {
        return res.status(500).json({ message: err })
      }

      const names = result.kml.Document[0].Placemark.map(
        (place: { name: string[] }) => ({
          name: place.name[0],
        })
      )
      return res.status(200).json(names)
    })
  })
})
app.post('/getAddressOutput', (req: Request, res: Response) => {
  const addressData: { [key: string]: string } = {
    'Stumpergasse 51, 1060 Vienna': 'au_vienna_schoenbrunnerstr',
    'Ungargasse 17, Vienna, Austria': 'au_vienna_landstrasserhauptstr',
    'Linzer Straße 7, Vienna, Austria': 'au_vienna_dreyhausenstr',
    'Maurer Hauptplatz 7, 1230 Wien, Austria': 'au_vienna_maurerhauptplatz',
  }

  const inputAddress = req.body.address

  if (!inputAddress || inputAddress.length === 0)
    return res
      .status(400)
      .json({ code: 400, message: 'Address field is required' })

  const output = addressData[inputAddress]

  if (!output) {
    return res.status(200).json({ success: false, message: 'not found' })
  }

  return res.json({ success: true, address: output })
})

app.use(express.static(path.join(__dirname, '../FE_build')))
// Anything that doesn't match the above, send back the index.html file
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../FE_build/index.html'))
})

app.listen(PORT, () => {
  console.log(`[server]: App is running on http://localhost:${PORT}`)
})
