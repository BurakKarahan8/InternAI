// ApplicationPage.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ApplicationPage.css"; // Güncellenmiş CSS
import HeaderBar from "./HeaderBar"; // veya ../components/HeaderBar

const ApplicationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // userData ve job bilgilerini location.state'ten alırken null check yap
    const userData = location.state?.userdata || null;
    const job = location.state?.job || null;

    const [coverLetter, setCoverLetter] = useState(""); // resume yerine coverLetter
    const [message, setMessage] = useState(null); // {text: '', type: 'success'/'error'}
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Eğer userData veya job bilgisi yoksa, kullanıcıyı ana sayfaya yönlendir veya hata göster
    useEffect(() => {
        if (!userData || !job) {
            // Kullanıcıyı bilgilendirip ana sayfaya yönlendirebiliriz
            alert("Başvuru bilgileri eksik veya geçersiz. Ana sayfaya yönlendiriliyorsunuz.");
            navigate(userData ? "/main" : "/", { state: { userdata: userData } });
        }
    }, [userData, job, navigate]);


    const applicantName = userData?.fullName || "N/A";
    const applicantEmail = userData?.email || "N/A";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!coverLetter.trim()) {
            setMessage({ text: "Lütfen bir ön yazı veya özgeçmiş linki girin.", type: 'error'});
            return;
        }
        if (!userData?.id || !job?.id) {
            setMessage({ text: "Kullanıcı veya ilan bilgileri eksik, başvuru yapılamıyor.", type: 'error'});
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        const applicationData = {
            userId: userData.id,
            jobPostId: job.id,
            coverLetter: coverLetter,
        };

        try {
            const response = await fetch("http://localhost:8080/api/applications/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(applicationData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = "Başvuru gönderilemedi.";
                if (response.status === 409) {
                    errorMessage = "Bu ilana daha önce başvurdunuz.";
                } else if (errorText) {
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage = errorJson.message || errorJson.error || errorText;
                    } catch {
                        errorMessage = errorText;
                    }
                }
                throw new Error(errorMessage);
            }
            // const responseData = await response.json(); // Eğer backend JSON dönerse
            setMessage({ text: "Başvurunuz başarıyla gönderildi!", type: 'success'});
            setCoverLetter(""); // Formu temizle
            // İsteğe bağlı: Başarılı başvurudan sonra kullanıcıyı başka bir sayfaya yönlendir
            // setTimeout(() => navigate("/user-applications", { state: { userdata: userData } }), 2000);
        } catch (err) {
            setMessage({ text: err.message || "Bir hata oluştu.", type: 'error'});
            console.error("Başvuru hatası:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!job || !userData) { // Eğer hala job veya userData yoksa (useEffect yönlendirene kadar)
         // Veya bir yükleniyor göstergesi
        return (
            <div className="application-container-wrapper">
                <HeaderBar userData={userData} />
                <div style={{flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white'}}>
                    Yükleniyor veya bilgi bulunamadı...
                </div>
            </div>
        );
    }

    return (
        <div className="application-container-wrapper">
            <HeaderBar userData={userData} />
            <div className="application-page-content">
                <h2>"{job.title}" İlanına Başvur</h2>
                <div className="job-details">
                    <p><strong>Şirket:</strong> {job.companyName}</p>
                    <p><strong>Açıklama:</strong> {job.description?.length > 150 ? job.description.substring(0,150) + "..." : job.description}</p>
                     {/* Daha fazla ilan detayı eklenebilir */}
                </div>


                <form onSubmit={handleSubmit} className="application-form">
                    <div className="applicant-info-display">
                        <p><strong>Ad Soyad:&nbsp;</strong> {applicantName}</p>
                        <p><strong>E-posta:&nbsp;&nbsp;&nbsp;&nbsp;</strong> {applicantEmail}</p>
                    </div>

                    <div> {/* Label ve textarea için bir sarmalayıcı */}
                        <label htmlFor="coverLetterInput">Ön Yazı / CV Linki*:</label>
                        <textarea
                            id="coverLetterInput"
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            placeholder="Ön yazınızı buraya yazın veya LinkedIn, GitHub, Drive gibi CV linkinizi ekleyin..."
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <button type="submit" className="application-submit-button" disabled={isSubmitting}>
                        {isSubmitting ? "Gönderiliyor..." : "Başvuruyu Gönder"}
                    </button>
                </form>

                {message && (
                    <p className={`application-message ${message.type === 'success' ? 'success' : 'error'}`}>
                        {message.text}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ApplicationPage;