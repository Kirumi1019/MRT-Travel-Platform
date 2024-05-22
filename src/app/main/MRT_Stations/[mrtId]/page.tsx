"use client"

import { useParams } from 'next/navigation'

function Station(){
    // useParams can get the containing the current route's dynamic parameters.
    const params = useParams<{mrtId: string}>();
    return (
        <>
            Station Id: {params.mrtId}
        </>
    )
}
export default Station