import './home.css'

function Home() {
    return (
        <div className='home-page'>

            {/* <div className='bg-dark'>
                <img className='topo' src={'./topo.png'} />
            </div> */}


            <div className='header-container'>
                <div className='name'>
                    <span className='header'>zing</span>
                    <span className='header-sec'>-rsa</span>
                </div>
                <div className='profession'>
                    <div>Full stack</div>

                    <div className='roller'>

                        <span id="rolltext">
                            web<br />
                            integrations<br />
                            blockchain<br />
                            cardano<br />
                        </span>
                    </div>

                    <div>developer</div>
                </div>
            </div>

            <div className='img-container'>
                <img className='zing-head' src={'./zing-long.jpg'} />
            </div>

            <div className='srcoll'>
                <i class="fa-solid fa-xl fa-chevron-down"></i>
            </div>
        </div>

    )
}

export default Home;