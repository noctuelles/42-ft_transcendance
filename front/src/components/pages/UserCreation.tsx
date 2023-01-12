import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import checkIcon from '../../assets/check_icon.png';
import '../../style/UserCreation.css';

function UserCreation() {
    const userContext = useContext(UserContext);
    return (
        <div className="user-creation">
            <h1 className="user-creation-title">
                Préparation du sujet pour l'expérience
            </h1>
            <form className="user-creation-form">
                <div className="user-creation-form-sec1">
                    <label className="user-creation-form-name-label user-creation-form-label">
                        Nom
                    </label>
                    <input
                        type="text"
                        value={userContext.auth.creatingUser.name}
                        className="user-creation-form-name-input"
                    />
                </div>
                <div className="user-creation-form-sec2">
                    <div className="user-creation-form-left">
                        <label className="user-creation-form-photo-label user-creation-form-label">
                            Photo
                        </label>
                        <img
                            src={userContext.auth.creatingUser.profile_picture}
                            alt="profile picture"
                            className="user-creation-form-image-preview"
                        />
                        <input
                            id="file"
                            name="file"
                            type="file"
                            accept="image/*"
                            className="user-creation-form-image-input"
                        />
                        <label
                            htmlFor="file"
                            className="user-creation-file-label"
                        >
                            Sélectionner un fichier
                        </label>
                    </div>
                    <div className="user-creation-form-right">
                        <button className="user-creation-form-btn user-creation-form-btn-ready">
                            <img
                                src={checkIcon}
                                alt="validate"
                                className="user-creation-form-check"
                            />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default UserCreation;
