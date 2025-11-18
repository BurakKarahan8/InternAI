package com.burakkarahan.InternAI;

import com.burakkarahan.InternAI.model.User;
import com.burakkarahan.InternAI.model.VerificationToken;
import com.burakkarahan.InternAI.repository.UserRepository;
import com.burakkarahan.InternAI.repository.VerificationTokenRepository;
import com.burakkarahan.InternAI.service.EmailService;
import com.burakkarahan.InternAI.service.UserService;

// Gerekli yeni importlar
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;


/**
 * Bu ana anotasyon, Spring'e aşağıdaki 'TestConfig' sınıfını kullanarak
 * küçük ve izole bir uygulama bağlamı (context) başlatmasını söyler.
 * Bu, tüm uygulamayı başlatan @SpringBootTest'ten çok daha hızlıdır.
 */
@SpringJUnitConfig
class InternAiApplicationTests {

	/**
	 * Test için özel bir konfigürasyon sınıfı. Spring sadece burada tanımlanan
	 * bean'leri yükleyecektir.
	 */
	@Configuration
	static class TestConfig {

		/**
		 * Test edeceğimiz gerçek UserService bean'ini tanımlıyoruz.
		 * Spring, bu bean'i oluşturmak için gereken parametreleri (userRepository, emailService vb.)
		 * yine bu konfigürasyon sınıfındaki diğer @Bean metodlarından alacaktır.
		 */
		@Bean
		public UserService userService(UserRepository userRepository,
									   VerificationTokenRepository tokenRepository,
									   EmailService emailService) {
			// Lombok'un @RequiredArgsConstructor'ının yaptığı işi burada manuel yapıyoruz.
			return new UserService(userRepository, tokenRepository, emailService);
		}

		/**
		 * UserService'in bağımlılıklarını SAHTE (MOCK) olarak tanımlıyoruz.
		 * Bu metodlar, sahte bir UserRepository ve EmailService nesnesi oluşturup
		 * bunları birer bean olarak Spring'e sunar.
		 */
		@Bean
		public UserRepository userRepository() {
			return Mockito.mock(UserRepository.class);
		}

		@Bean
		public VerificationTokenRepository tokenRepository() {
			return Mockito.mock(VerificationTokenRepository.class);
		}

		@Bean
		public EmailService emailService() {
			return Mockito.mock(EmailService.class);
		}
	}

	// Spring, yukarıdaki TestConfig'te oluşturduğu bean'leri bu alanlara enjekte eder.
	@Autowired
	private UserService userService; // Bu gerçek bir UserService nesnesidir.

	@Autowired
	private UserRepository userRepository; // Bu, TestConfig'te tanımladığımız sahte nesnedir.

	@Autowired
	private VerificationTokenRepository tokenRepository; // Bu da sahte nesnedir.

	@Autowired
	private EmailService emailService; // Bu da sahte nesnedir.


	@Test
	public void testRegisterUser() {
		// Testin bu kısmı HİÇ DEĞİŞMEZ. Mantık tamamen aynıdır.

		// 1. Hazırlık (Arrange): Sahte nesnelerin nasıl davranacağını tanımla.
		User user = new User();
		user.setUsername("burak78");
		user.setPassword("123456");
		user.setEmail("burak7887@gmail.com");
		user.setFullName("Burak Karahan");
		user.setGithubUsername("BurakKarahan8");

		// @Autowired ile aldığımız sahte userRepository'nin davranışını belirliyoruz.
		when(userRepository.save(any(User.class))).thenReturn(user);
		doNothing().when(emailService).sendEmail(anyString(), anyString(), anyString());

		// 2. Eylem (Act): Test edilecek olan metodu çağır.
		userService.registerUser(user);

		// 3. Doğrulama (Assert/Verify): Sahte nesnelerin beklendiği gibi çağrıldığını kontrol et.
		verify(userRepository, times(1)).save(user);
		verify(tokenRepository, times(1)).save(any(VerificationToken.class));

		ArgumentCaptor<String> toEmailCaptor = ArgumentCaptor.forClass(String.class);
		ArgumentCaptor<String> subjectCaptor = ArgumentCaptor.forClass(String.class);
		ArgumentCaptor<String> bodyCaptor = ArgumentCaptor.forClass(String.class);

		verify(emailService, times(1)).sendEmail(toEmailCaptor.capture(), subjectCaptor.capture(), bodyCaptor.capture());

		assertEquals("burak7887@gmail.com", toEmailCaptor.getValue());
		assertEquals("Hesabınızı Doğrulayın", subjectCaptor.getValue());
		assertTrue(bodyCaptor.getValue().contains("Hesabınızı doğrulamak için şu linke tıklayın:"));
	}
}