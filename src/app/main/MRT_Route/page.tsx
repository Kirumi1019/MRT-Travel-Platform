import Image from 'next/image'
import metroRoutePic from '@/../public/metrotaipeimap.jpg'
function MRT_Route() {
    return(
          <>
            <div className="flex justify-center">
              <Image
                src={metroRoutePic}
                alt="Metro Route Picture"
                width={680}
              />
             </div>
          </>
    )
}

export default MRT_Route;