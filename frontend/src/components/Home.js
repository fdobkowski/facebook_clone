const Home = () => {
    return (
        <div>
            <div className={"side_bar"}>
                <button>Profile</button>
                <button>Friends</button>
            </div>
            <div className={"main"}>
                <div className={"create_post"}>
                    <div>Image</div>
                    <div>
                        <span>What do you think about?</span>
                    </div>
                </div>
                <div className={"posts"}>
                    Posts
                </div>
            </div>
            <div className={"friends_list"}>

            </div>
        </div>
    )
}

export default Home