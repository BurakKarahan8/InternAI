import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";
import "./UserProfileSettings.css";

const UserProfileSettings = () => {
    const location = useLocation();
    const userData = location.state?.userdata;

    const [fullName, setFullName] = useState(userData?.fullName || "");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState(userData?.profilePicture || null);
    const [preview, setPreview] = useState(
        userData?.profilePicture
            ? `data:image/jpeg;base64,${userData.profilePicture}`
            : "https://i.pravatar.cc/150"
    );

    const handleSave = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/users/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: userData?.email,
                    fullName: fullName,
                    password: password,
                }),
            });

            if (response.ok) {
                alert("Bilgileriniz güncellendi.");
                setPassword("");
            } else {
                alert("Güncelleme sırasında bir hata oluştu.");
            }
        } catch (error) {
            console.error(error);
            alert("Sunucuya bağlanılamadı.");
        }
    };

    const pickImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleUpdateProfilePicture = async () => {
        if (!image) return;

        const formData = new FormData();
        formData.append("email", userData?.email);
        formData.append("profilePicture", image);

        try {
            const response = await fetch(
                "http://localhost:8080/api/users/update-profile-picture",
                {
                    method: "PUT",
                    body: formData,
                }
            );

            if (response.ok) {
                alert("Profil fotoğrafınız güncellendi.");
            } else {
                alert("Fotoğraf güncellenirken bir hata oluştu.");
            }
        } catch (error) {
            console.error(error);
            alert("Fotoğraf güncellenemedi.");
        }
    };

    return (
        <div className="user-settings-page">
            <HeaderBar userData={userData} />
            <div className="user-settings-container">
                <h2>Bilgilerini Güncelle</h2>
                <div className="user-settings-form">
                    <div className="user-settings-info">
                        <div className="user-settings-info-item">
                            <label className="user-settings-label">Email:&nbsp;&nbsp;</label>
                            <div className="user-settings-label">{userData?.email}</div>
                        </div>
                        <div className="user-settings-info-item">
                            <label className="user-settings-label">Kullanıcı Adı:&nbsp;&nbsp;</label>
                            <div className="user-settings-label">{userData?.username}</div>
                        </div>
                    </div>

                    <label>Ad Soyad</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />

                    <label>Yeni Şifre</label>
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button onClick={handleSave} className="user-settings-save-button">
                        Kaydet
                    </button>

                    <label>Profil Fotoğrafı</label>
                    <img src={preview} alt="Profil" className="user-settings-avatar" />
                    <input type="file" accept="image/*" onChange={pickImage} />
                    <button className="user-settings-save-button" onClick={handleUpdateProfilePicture}>
                        Fotoğrafı Güncelle
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfileSettings;
