import bodyParser from 'body-parser';
import express from 'express';
import { ActivityInterface } from "@blockchain-carbon-accounting/data-common/utils"
import { parseCommonYargsOptions} from "@blockchain-carbon-accounting/data-postgres/src/config"
import {PostgresDBService } from "../../data/src/postgresDbService"
import { argv } from 'process';
import * as dotenv from 'dotenv'
dotenv.config({path:'../../../.env'})

const app = express();
const port = 3002;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);


app.get('/', (request, response) => {
    response.json({ info: 'welcome to Postgres API' });
});

app.post('/postgres/uuid', async(req,res)=>{
    const db = await PostgresDBService.getInstance(parseCommonYargsOptions(argv))
    const uuid = req.body.uuid.toString()
    const usage = Number(req.body.usage)
    const mockUtilityID = 'USA_EIA_11208';
    const usageUOM = req.body.usageUOM.toString()
    const thruDate= req.body.thruDate.toString()
    const lookup= await db.getUtilityLookupItemRepo().getUtilityLookupItem(uuid)
    console.log("water")
    if(lookup==null){ 
    res.status(500);
    }
        else{
    const ans= await db.getEmissionsFactorRepo().getCO2EmissionFactorByLookup(lookup,usage,usageUOM,thruDate);
    db.close();
        
       res.json(ans);
        }
})


app.post('/postgres/Activity', async(req,res)=>{
    const db = await PostgresDBService.getInstance(parseCommonYargsOptions(argv))

     const activity: ActivityInterface = {
     scope : req.body.scope.toString(),
     level_1 : req.body.level1.toString(),
     level_2 : req.body.level2.toString(),
     level_3 : req.body.level3.toString(),
     level_4 : req.body.level4.toString(),
     text : req.body.text.toString(),
     activity : Number(req.body.amount),
     activity_uom : req.body.uom.toString(),
    }

    const ans= await db.getEmissionsFactorRepo().getCO2EmissionByActivity(activity);
    db.close();
       res.json(ans);
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
