import {useAuth0, User} from "@auth0/auth0-react";


const Profile = () => {
    const {user, isAuthenticated} = useAuth0();

    return (
        isAuthenticated && (
            <article className="column">
                {user?.picture && <img src={user.picture} alt={user?.name}/>}
                <h2>{user?.name}</h2>
                <ul>
                    {Object.keys(user as User).map((objKey, i) => <li key={i}>{objKey}: {user?.objKey}</li>)}
                </ul>
            </article>
        )
    )
}

export default Profile;
