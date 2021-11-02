import React from 'react'
import './PageHeader.css'

export const PageHeader = ({children}) => {
    return (
        <div className="page-header">
            <h1>{children}</h1>
        </div>
    )
}
