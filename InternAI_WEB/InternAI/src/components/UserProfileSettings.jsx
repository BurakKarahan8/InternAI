// UserProfileSettings.js
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";
import "./UserProfileSettings.css";
import { Oval } from 'react-loader-spinner';
import { FaSave, FaCamera, FaUserCircle, FaKey, FaEnvelope, FaUserTag } from 'react-icons/fa';

const UserProfileSettings = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialUserData = location.state?.userdata || null;

    // userData'yı local state'te tutarak güncellemeleri yansıtıyoruz.
    // İdealde bu global bir context'ten gelmeli ve orada güncellenmeli.
    const [userData, setUserData] = useState(initialUserData);

    const [fullName, setFullName] = useState(initialUserData?.fullName || "");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(
        initialUserData?.profilePicture
            ? `data:image/jpeg;base64,${initialUserData.profilePicture}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(initialUserData?.fullName || 'U')}&background=283958&color=E0E0E0&size=130`
    );

    const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);
    const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);

    useEffect(() => {
        if (!initialUserData) {
            alert("Kullanıcı bilgileri olmadan bu sayfaya erişilemez. Giriş sayfasına yönlendiriliyorsunuz.");
            navigate("/"); // Ana sayfaya veya giriş sayfasına yönlendir
        }
        // userData state'ini initialUserData değiştiğinde güncelle (eğer gerekirse)
        setUserData(initialUserData);
        setFullName(initialUserData?.fullName || "");
        setImagePreview(
            initialUserData?.profilePicture
                ? `data:image/jpeg;base64,${initialUserData.profilePicture}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(initialUserData?.fullName || 'U')}&background=283958&color=E0E0E0&size=130`
        );

    }, [initialUserData, navigate]);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Bu imagePreview base64 string içerir
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfilePicture = async () => {
        if (!selectedImageFile) {
            alert('Lütfen önce bir fotoğraf seçin.');
            return;
        }
        if (!userData?.email) {
            alert("Kullanıcı e-postası bulunamadı.");
            return;
        }
        setIsUpdatingPhoto(true);
        const formData = new FormData();
        formData.append("email", userData.email);
        formData.append("profilePicture", selectedImageFile);

        try {
            const response = await fetch('http://localhost:8080/api/users/update-profile-picture', {
                method: 'PUT',
                body: formData,
            });

            const responseText = await response.text(); // Yanıtı her zaman metin olarak al
            console.log("Update Photo - Backend Ham Yanıtı:", responseText);
            console.log("Update Photo - Backend Yanıt Durumu:", response.status);

            if (response.ok) {
                alert(responseText || 'Profil fotoğrafınız başarıyla güncellendi.');

                if (imagePreview && imagePreview.startsWith('data:image')) {
                    const newBase64 = imagePreview.split(',')[1];
                    // Local state'i (ve dolayısıyla HeaderBar'a giden userData'yı) güncelle
                    setUserData(prev => {
                        const updatedUser = { ...prev, profilePicture: newBase64 };
                        // Eğer global state (Context API) kullanıyorsanız burada onu da güncelleyin
                        // örn: userAuthContext.updateUser({ profilePicture: newBase64 });
                        return updatedUser;
                    });
                }
                setSelectedImageFile(null);

            } else {
                // Hata mesajı da metin olarak bekleniyor
                alert(`Fotoğraf Güncelleme Hatası: ${responseText || 'Bilinmeyen bir hata oluştu.'}`);
            }
        } catch (error) {
            console.error("Update Photo - Ağ veya Beklenmedik Hata:", error);
            alert('Fotoğraf güncellenemedi. Bağlantınızı kontrol edin veya beklenmedik bir sorun oluştu.');
        } finally {
            setIsUpdatingPhoto(false);
        }
    };

    const handleUpdateInfo = async () => {
        if (newPassword && newPassword !== confirmNewPassword) {
            alert("Yeni şifreler eşleşmiyor.");
            return;
        }
        if (!fullName.trim()) {
            alert("Ad Soyad alanı boş bırakılamaz.");
            return;
        }
        if (!userData?.email) {
            alert("Kullanıcı e-postası bulunamadı.");
            return;
        }

        setIsUpdatingInfo(true);
        const payload = {
            email: userData.email,
            fullName: fullName,
        };

        if (newPassword) {
            if (newPassword.length < 6) {
                alert("Yeni şifre en az 6 karakter olmalıdır.");
                setIsUpdatingInfo(false);
                return;
            }
            payload.password = newPassword;
        }

        try {
            const response = await fetch('http://localhost:8080/api/users/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const responseText = await response.text(); // Yanıtı her zaman metin olarak al
            console.log("Update Info - Backend Ham Yanıtı:", responseText);
            console.log("Update Info - Backend Yanıt Durumu:", response.status);

            if (response.ok) {
                alert(responseText || 'Bilgileriniz başarıyla güncellendi.');

                // Local state'i (ve dolayısıyla HeaderBar'a giden userData'yı) güncelle
                setUserData(prev => {
                    const updatedUser = { ...prev, fullName: fullName };
                    // Eğer global state (Context API) kullanıyorsanız burada onu da güncelleyin
                    // örn: userAuthContext.updateUser({ fullName: fullName });
                    return updatedUser;
                });

                setNewPassword("");
                setConfirmNewPassword("");

            } else {
                // Hata mesajı da metin olarak bekleniyor
                alert(`Bilgi Güncelleme Hatası: ${responseText || 'Bilinmeyen bir hata oluştu.'}`);
            }
        } catch (error) {
            console.error("Update Info - Ağ veya Beklenmedik Hata:", error);
            alert('Bilgiler güncellenemedi. Bağlantınızı kontrol edin veya beklenmedik bir sorun oluştu.');
        } finally {
            setIsUpdatingInfo(false);
        }
    };


    if (!userData) {
        return (
            <div className="user-settings-page-wrapper">
                <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <Oval height={80} width={80} color="#82E0AA" secondaryColor="rgba(130, 224, 170, 0.3)" strokeWidth={3} />
                </div>
            </div>
        );
    }

    return (
        <div className="user-settings-page-wrapper">
            {/* HeaderBar'a güncellenmiş userData'yı pass ediyoruz */}
            <HeaderBar userData={userData} />
            <div className="user-settings-container">
                <h2>Kullanıcı Ayarları</h2>

                <form className="user-settings-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-section">
                        <h3 className="form-section-title"><FaCamera /> Profil Fotoğrafı</h3>
                        <div className="user-settings-avatar-container">
                            <img src={imagePreview} alt="Profil Önizleme" className="user-settings-avatar-preview" />
                            <label htmlFor="avatarUpload" className="user-settings-file-input">
                                {selectedImageFile ? selectedImageFile.name : "Yeni Fotoğraf Seç"}
                            </label>
                            <input
                                id="avatarUpload"
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            {selectedImageFile && (
                                <button onClick={handleUpdateProfilePicture} className="user-settings-button" disabled={isUpdatingPhoto} style={{maxWidth: '200px', marginTop: '0px'}}>
                                    {isUpdatingPhoto ? <Oval height={18} width={18} color="#1D2B4A" strokeWidth={5}/> : "Fotoğrafı Yükle"}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="form-section">
                            <h3 className="form-section-title"><FaUserCircle /> Kişisel Bilgiler</h3>
                        <div className="settings-input-group">
                            <label htmlFor="emailInfo" className="user-settings-label"><FaEnvelope /> E-posta (Değiştirilemez)</label>
                            <div id="emailInfo" className="user-settings-static-info">{userData.email}</div>
                        </div>
                            <div className="settings-input-group">
                            <label htmlFor="usernameInfo" className="user-settings-label"><FaUserTag /> Kullanıcı Adı (Değiştirilemez)</label>
                            <div id="usernameInfo" className="user-settings-static-info">{userData.username}</div>
                        </div>
                        <div className="settings-input-group">
                            <label htmlFor="fullNameInput" className="user-settings-label">Ad Soyad</label>
                            <input
                                id="fullNameInput" type="text" className="user-settings-input"
                                value={fullName} onChange={(e) => setFullName(e.target.value)}
                                placeholder="Adınız ve Soyadınız"
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title"><FaKey /> Şifre Değiştir</h3>
                        <div className="settings-input-group">
                            <label htmlFor="newPasswordInput" className="user-settings-label">Yeni Şifre (Değiştirmek istemiyorsanız boş bırakın)</label>
                            <input
                                id="newPasswordInput" type="password" className="user-settings-input"
                                value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Yeni şifreniz (en az 6 karakter)"
                            />
                        </div>
                        <div className="settings-input-group">
                            <label htmlFor="confirmNewPasswordInput" className="user-settings-label">Yeni Şifre (Tekrar)</label>
                            <input
                                id="confirmNewPasswordInput" type="password" className="user-settings-input"
                                value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)}
                                placeholder="Yeni şifrenizi doğrulayın"
                            />
                        </div>
                    </div>

                    <button onClick={handleUpdateInfo} className="user-settings-button" disabled={isUpdatingInfo}>
                        {isUpdatingInfo ? <Oval height={20} width={20} color="#1D2B4A" strokeWidth={5}/> : <><FaSave /> Bilgileri Kaydet</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserProfileSettings;