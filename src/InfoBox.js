import React from 'react'
import {Card, CardContent,Typography} from "@material-ui/core"
import './InfoBox.css'
import  {prettyPrintStat} from  './util'

function InfoBox({title,cases,active,isRed,isPurple,total,num,...props}){
    return (
        
        <Card onClick={props.onClick} className={`infobox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'} ${isPurple && 'infoBox--purple'}`}>
            <CardContent  >
                {/*Title*/}
                <Typography className={`infoBox__title`} color="textSecondary">
                    {title}
                </Typography>

                {/* 120k Number of cases */}
                <h2 className={`infoBox__cases${num}`}>{prettyPrintStat(cases)}</h2>

                {/*1.2M Total */}
                <Typography className="infoBox__total" color="textSecondary">
                    {prettyPrintStat(total)} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
