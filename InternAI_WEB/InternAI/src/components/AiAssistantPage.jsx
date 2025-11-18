// src/components/AiAssistantPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderBar from './HeaderBar'; // Veya ../components/HeaderBar
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // GitHub Flavored Markdown için
import { Oval } from 'react-loader-spinner';
import { FaPaperPlane, FaRobot, FaExclamationTriangle } from 'react-icons/fa';
import './AiAssistantPage.css'; // Stil dosyasını oluşturacağız

// GELİŞTİRME İÇİN API ANAHTARI - CANLIYA ALMADAN ÖNCE MUTLAKA BACKEND'E TAŞIYIN!
const GEMINI_API_KEY = 'AIzaSyB9GleI5hWLMs-udeTScjnkTEGJmu4OcWI'; // <<--- KENDİ GEMINI API ANAHTARINIZI GİRİN!

const AiAssistantPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const userData = location.state?.userdata || null; // HeaderBar ve prompt için

    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!userData) {
            alert("Bu sayfaya erişmek için giriş yapmalısınız.");
            navigate("/"); // Veya /login
        }
    }, [userData, navigate]);

    const handleSendQuery = async () => {
        if (!query.trim()) {
            setError('Lütfen bir soru veya konu girin.');
            return;
        }
        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
            setError('Gemini API anahtarı ayarlanmamış veya geçersiz. Lütfen geliştirici ile iletişime geçin.');
            // Geliştirme aşamasında bu hata kullanıcıya gösterilmeyebilir, konsola loglanabilir.
            console.error('Gemini API anahtarı ayarlanmamış!');
            return;
        }

        setIsLoading(true);
        setResponse('');
        setError('');

        // API URL ve modelini mobil uygulamadakine benzer şekilde ayarlayın
        // Örnek: 'gemini-1.5-flash-latest' veya 'gemini-pro'
        // DOKÜMANTASYONU KONTROL EDİN! v1beta veya v1 endpoint'i.
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;


        // Prompt'u mobil uygulamadaki gibi oluşturabilirsiniz
        const promptText = `Bir staj arayan öğrenciyim (Kullanıcı: ${userData?.fullName || 'Bilinmiyor'}). Bana şu konuda yardımcı ol: "${query}". Staj bulma, mülakat hazırlığı veya kariyer geliştirme odaklı, kısa ve öz tavsiyeler ver. Cevabını Markdown formatında ver.`;

        try {
            const apiResponse = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: promptText }]
                    }],
                    // generationConfig: { // İsteğe bağlı
                    //   temperature: 0.7,
                    //   maxOutputTokens: 800,
                    // }
                }),
            });

            const responseData = await apiResponse.json();

            if (!apiResponse.ok) {
                console.error('Gemini API Error Data:', responseData);
                const apiError = responseData.error?.message || `API Hatası: ${apiResponse.status}`;
                throw new Error(apiError);
            }

            if (responseData.candidates && responseData.candidates.length > 0 &&
                responseData.candidates[0].content && responseData.candidates[0].content.parts &&
                responseData.candidates[0].content.parts.length > 0) {
                setResponse(responseData.candidates[0].content.parts[0].text);
            } else if (responseData.promptFeedback && responseData.promptFeedback.blockReason) {
                setError(`İsteğiniz içerik politikası (${responseData.promptFeedback.blockReason}) nedeniyle engellendi.`);
                console.warn('Gemini Content Blocked:', responseData.promptFeedback);
            } else {
                setResponse('Yapay zekadan bir yanıt alınamadı veya yanıt formatı beklenmedik.');
                console.warn('Gemini Unexpected Response Format:', responseData);
            }

        } catch (err) {
            console.error('Gemini API İsteği Hatası:', err);
            setError(err.message || 'Yapay zeka ile iletişimde bir sorun oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!userData) { // useEffect yönlendirene kadar bir yükleme/boş ekran
        return (
            <div className="ai-page-wrapper">
                 <div style={{flexGrow:1, display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <Oval height={80} width={80} color="#82E0AA" secondaryColor="rgba(130, 224, 170, 0.3)" strokeWidth={3} />
                </div>
            </div>
        );
    }

    return (
        <div className="ai-page-wrapper">
            <HeaderBar userData={userData} />
            <div className="ai-container">
                <div className="ai-header-logo">
                    <FaRobot className="ai-icon-robot" />
                    <h1>AI Staj Asistanınız</h1>
                    <p>Staj yolculuğunuzda size nasıl yardımcı olabilirim?</p>
                </div>

                <div className="ai-input-section">
                    <textarea
                        className="ai-textarea"
                        placeholder="Örn: Etkili bir ön yazı nasıl yazılır?"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                                e.preventDefault(); // Enter'a basınca yeni satır oluşturmasını engelle
                                handleSendQuery();
                            }
                        }}
                        disabled={isLoading}
                    />
                    <button
                        className="ai-send-button"
                        onClick={handleSendQuery}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Oval height={20} width={20} color="#1D2B4A" strokeWidth={5} />
                        ) : (
                            <FaPaperPlane />
                        )}
                    </button>
                </div>

                {error && (
                    <div className="ai-error-message">
                        <FaExclamationTriangle /> {error}
                    </div>
                )}

                {isLoading && !response && !error && (
                    <div className="ai-loading-response">
                        <Oval height={50} width={50} color="#82E0AA" secondaryColor="rgba(130, 224, 170, 0.3)" strokeWidth={4} />
                        <p>Yapay zeka düşünüyor...</p>
                    </div>
                )}

                {response && !isLoading && (
                    <div className="ai-response-card">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {response}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiAssistantPage;