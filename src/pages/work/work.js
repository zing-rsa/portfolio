import './work.css'

import {useEffect} from 'react'

function Work ({pos}) {

    useEffect(() => {

        // scrolling
        var main = document.getElementById('main');
        var backtext = document.getElementById('work-back-text');
        
        var work = document.getElementById('work');
        
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        var targetCentPos = pos * vh - (0.5 * vh);
        var currCentPos;
        var diff;
        
        main.addEventListener('scroll', () => {
            console.log('scrolled')
            currCentPos = main.scrollTop + (vh * 0.5);
            diff = (targetCentPos - currCentPos);

            backtext.style.transform =  'translateX(' + (diff - 500) * 2 + 'px)';

            if (diff < 10) {
                main.style.overflow = 'hidden'
                main.scrollTo(0, targetCentPos - (vh * 0.5))
                work.style.overflow = 'scroll'
            }

            //work specific scrolling

            


        });

        

    }, []);

    return (
        <div id='work' className='page work-page'>
            <div className='back-text-container'>
                <div id='work-back-text'>WORK</div>
            </div>
            <div className='work-container'>

            </div>
        </div>
    )
}

export default Work;