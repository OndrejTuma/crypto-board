import React, { useEffect, useRef } from 'react'

const BinanceFiatWidget = () => {
  const widgetRef = useRef(null)

  useEffect(() => {
    return import('binance-fiat-widget').then(({ unloadWidget, Widget }) => {
      Widget(widgetRef.current)

      return () => unloadWidget()
    })
  }, [])

  return (
    <div ref={widgetRef}/>
  )
}

export default BinanceFiatWidget