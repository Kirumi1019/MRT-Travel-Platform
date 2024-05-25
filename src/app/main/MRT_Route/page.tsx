import Image from 'next/image'
import metroRoutePic from '@/../public/metrotaipeimap.jpg'
function MRT_Route() {
    return(
        <>
          <div>
            MRT Route Picture
          </div>
          <Image
            src={metroRoutePic}
            alt="Metro Route Picture"
            width={800}
          />
        </>
    )
}

export default MRT_Route;