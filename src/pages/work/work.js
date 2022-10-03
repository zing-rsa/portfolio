import './work.css'

import {useEffect} from 'react'

function Work ({pos}) {

    useEffect(() => {

        var main = document.getElementById('main');
        var backtext = document.getElementById('work-back-text');

        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        var targetCentPos = pos * vh - (0.5 * vh);
        var currCentPos;
        var diff;

        main.addEventListener('scroll', () => {
            currCentPos = main.scrollTop + (vh * 0.5);
            diff = (targetCentPos - currCentPos)

            backtext.style.transform =  'translateX(' + (diff - 500) * 2 + 'px)';
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