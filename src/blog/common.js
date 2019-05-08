import { Card, Tag } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

export function ListContent(props) {
    const { title, data, linkPath } = props
    return (
        <Card>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <p>{title}</p>
                <Link to={linkPath}>更多</Link>
            </div>
            <div>
                {data.map((item, index) => 
                    <Link to={{pathname: `/article/detail/${item.id}`, query: {name: title}}} key={index}>
                        <p>{item.title}</p> 
                    </Link>
                )}
            </div>
           
        </Card>
    )
}

export function TagContent(props) {
    const { title, data } = props
    return (
        <Card style={{display: "flex"}}>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <p>{title}</p>
            </div>
            {data.map((item, index) => {
                return <Link key={index} to={{pathname: "/article/all", query:{tag: item.tag}}}><Tag key={index}>{item.tag}({item.total})</Tag></Link>
            })}
        </Card>
    )
}