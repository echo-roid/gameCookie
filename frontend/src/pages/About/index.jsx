
import Seo from '../../components/Seo.jsx';



export function About() {

    const logoUrl = import.meta.env.VITE_BASE_URL + '/images/logo.png';

	return (
		<>

        {/* <Seo
            title="About Us – GamesCookie"
            description="Learn more about GamesCookie — your ultimate destination for free online HTML5 games. Discover who we are, our mission, and our passion for bringing fun, safe, and instant gaming to everyone."
            keywords="About GamesCookie, GamesCookie team, free online games platform, HTML5 games creators, about gaming website, instant play games"
            canonical={`${import.meta.env.VITE_BASE_URL}/about`}
            ogType="website"
            /> */}

        <div class="container">
            

            <div class="page-header">
            <div class="header-content">
                <a href="/" className="navbar-brand-custom text-decoration-none" onClick={() => reloadHome()}>
								<img 
								src={logoUrl} 
								alt="GamesCookie" 
								style={{height: '90px'}}
								/>
							</a>
                <h1 class="page-title">About GamesCookie</h1>
                <p class="page-subtitle">
                    
                        <p>Welcome to GamesCookie — your ultimate stop for free-to-play online games!</p>

                        <p>We believe gaming should be simple, fun, and accessible to everyone. That’s why GamesCookie brings you a fresh batch of HTML5 (H5) games that run instantly on any device — no downloads, no installs, just click and play.</p>

                        <p>From thrilling action challenges and mind-bending puzzles to sports, arcade, and casual games — there’s something here for everyone. Whether you have five minutes or fifty, you’ll always find a fun little “cookie” to enjoy! 🍪</p>

                        <p class="my-heading">🎯 Our Mission</p>

                        <p>To make gaming effortless and enjoyable for players of all ages by offering a smooth, ad-supported platform filled with handpicked, high-quality browser games.</p>

                        <p class="my-heading">💡 What We Offer</p>

                        <p class="features">
                            <span>100% free games, always</span>
                            <span>Works on mobile, tablet, and desktop</span>
                        </p>

                        <p class="features">
                            <span>No sign-ups or downloads required</span>
                            <span>New games added regularly</span>
                        </p>


                        <p class="my-heading">🚀 Play. Relax. Repeat.</p>

                        <p>At GamesCookie, we’re passionate about creating a space where anyone can unwind and have fun, anytime and anywhere.</p>

                        <p>So go ahead — pick a game, start playing, and treat yourself to a sweet gaming break!</p>

                </p>
            </div>
        </div>


        </div>

        </>
    )
}