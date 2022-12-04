import Image from "next/image";
import { use, useState, Component } from "react";
import { createClient } from '@supabase/supabase-js';
import 'bulma/css/bulma.min.css';
import style from '../scss/index.module.scss';
import Link from "next/link";


export async function getStaticProps() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  const {data} = await supabaseAdmin
    .from('images')
    .select('*')
    .order('id');
  return {
    props: {
      images: data
    },
  }

}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type Image = {
  id: number
  href: string
  imageSrc: string
  year: string
  description: string
}

export default function Gallery({ images }: { images: Image[] }) {
  const [showImageModal, setShowImageModal] = useState(false); // this is what needs to be changed by the base
  const [imageToShow, setImageToShow] = useState(null);
  
  function imageClick(props){
    console.log("Clicked")
    
    setImageToShow(props);
    setShowImageModal(true);

  }
  
  return (
    
    <>
     <div className={`columns is-multiline`}>
          <div className={`column is-two-thirds is-centered box `}>

            <h1 className={`is-centered ${style.title}`}>Hello</h1>
          </div>
        </div>

      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
    
        

        
        {showImageModal
          // 
          ? <PopupModal imageElement={imageToShow} showImageModal={showImageModal} setShowImageModal={setShowImageModal} />
          : <></>
        }
        
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-9">
          {images.map((image) => (
            <>
            
              <div onClick={() => imageClick(image)}>
                  <BlurImage key={image.id} image={image}/>
              </div>
            </>
          ))}
        </div>
      </div>
    </>

    
  ); 
}

function BlurImage({image}: {image: Image}, {onClick}) {
  const [isLoading, setLoading] = useState(true);

  return(
    <a href="#" className="group">
      <div className="aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8 w-full overflow-hidden rounded-lg bg-gray-200">
        <Image
          alt=""
          src={image.imageSrc}
          layout="fill"
          objectFit="cover"
          className={cn(
            'group-hover:opacity-75 duration-700 ease-in-out',
            isLoading
              ? 'grayscale blur-2xl scale-110'
              : 'grayscale-0 blur-0 scale-100'
          )}
          onLoadingComplete={() => setLoading(false)}
          />
      </div>
      <p className="mt-1 text-lg font-medium text-gray-900">{image.year}</p>
    </a>
  )

}

function PopupModal ({imageElement, showImageModal, setShowImageModal }) {
  const [modalActive, setModalActive] = useState('is-active');
  
  function handleClose() {
    setShowImageModal(false);
  }
  
  return (
    <div className={`modal ${modalActive}`}>
      <div className={`modal-background`} onClick={handleClose}></div>
      <div className={`modal-content`}>
        <div className={`box`}>
          {/* THE HREF TAG IS ESSENTIALLY THE SOURCE */}
          <a href={imageElement.href} target="_blank" rel="noopener noreferrer">
            <img src={imageElement.imageSrc}/>
          </a>
          <p>{imageElement.description}</p>
        </div>

      </div>
      <button className={`modal-close is-large`} onClick={handleClose}></button>
    </div>
  )
}