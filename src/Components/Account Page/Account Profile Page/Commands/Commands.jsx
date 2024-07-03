import React, { useEffect, useState } from 'react'
import classes from './Commands.module.css'
import EmptyContainer from '../../Common/Empty Container/EmptyContainer'
import { orders } from '../../constants/data'
import HistoryCard from './History Card/HistoryCard'

const Commands = () => {
  const [data, setData] = useState([])

  useEffect(()=>{
    
    const historyOrders = orders.filter((item) => item.status === 'history');
    setData(historyOrders);
    
  },[orders])
  return (
    <div className={classes.commandsContainer}>
            <div className={classes.header}>
            <div className={classes.headtitle}>MES COMMANDES</div>
            <div className={classes.border} />
            </div>
            <div>
              <div style={{width:'136%',marginLeft:'-16%'}}>
          {data.length === 0 ? <EmptyContainer title={'MES COMMANDES'}/> :  <>
          {data?.map((props)=>{
            return(
              <HistoryCard data={props}/>
             )
          })} </>}
          </div>
        </div>
       </div>  
  )
}

export default Commands