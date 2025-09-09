'use client'
import React from 'react'

const SkipFirstRender = ({children}:{children:React.ReactNode}) => {
    const [skip, setSkip] = React.useState(false)
    React.useEffect(() => {
        setSkip(true)
    },[])

    if(!skip) return null
  return (
    <>
     {children} 
    </>
  )
}

export default SkipFirstRender
