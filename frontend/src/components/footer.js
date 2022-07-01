import "../styles/Footer.scss"

const Footer = () => {
    return (
        <footer className={"footer"}>
            <div>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                    <img src={require("../assets/fb.png")} alt="fb" />
                </a>

                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                    <img src={require("../assets/ig.png")} alt="ig" />
                </a>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
                    <img src={require("../assets/tw.png")} alt="tw" />
                </a>

                <a href="https://pl.linkedin.com/" target="_blank" rel="noopener noreferrer">
                    <img src={require("../assets/ln.png")} alt="ln" />
                </a>

                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
                    <img src={require("../assets/yt.png")} alt="yt" />
                </a>
            </div>
            <div>
                Florian Dobkowski @ 2022
            </div>
        </footer>
    )
}

export default Footer