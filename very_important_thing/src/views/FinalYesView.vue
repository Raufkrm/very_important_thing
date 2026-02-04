<script setup>
import { useRouter } from 'vue-router'
import { useAccessStore } from '../stores/access'

const router = useRouter()
const accessStore = useAccessStore()
const playerName = accessStore.displayName || 'you'

const hearts = Array.from({ length: 34 }, (_, index) => {
  const colors = ['#ef4444', '#f472b6', '#a855f7']
  return {
    id: index,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 6 + Math.random() * 6,
    size: 12 + Math.random() * 16,
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: 0.6 + Math.random() * 0.35,
  }
})

const messages = [
  { lang: 'English', text: 'I love you' },
  { lang: 'Spanish', text: 'Te amo' },
  { lang: 'French', text: "Je t'aime" },
  { lang: 'German', text: 'Ich liebe dich' },
  { lang: 'Italian', text: 'Ti amo' },
  { lang: 'Portuguese', text: 'Eu te amo' },
  { lang: 'Dutch', text: 'Ik hou van je' },
  { lang: 'Turkish', text: 'Seni seviyorum' },
  { lang: 'Swedish', text: 'Jag älskar dig' },
  { lang: 'Norwegian', text: 'Jeg elsker deg' },
  { lang: 'Danish', text: 'Jeg elsker dig' },
  { lang: 'Finnish', text: 'Rakastan sinua' },
  { lang: 'Icelandic', text: 'Ég elska þig' },
  { lang: 'Irish', text: 'Tá grá agam ort' },
  { lang: 'Welsh', text: "Rwy'n dy garu di" },
  { lang: 'Polish', text: 'Kocham cię' },
  { lang: 'Czech', text: 'Miluji tě' },
  { lang: 'Slovak', text: 'Ľúbim ťa' },
  { lang: 'Hungarian', text: 'Szeretlek' },
  { lang: 'Romanian', text: 'Te iubesc' },
  { lang: 'Bulgarian', text: 'Обичам те' },
  { lang: 'Greek', text: "Σ' αγαπώ" },
  { lang: 'Russian', text: 'Я люблю тебя' },
  { lang: 'Ukrainian', text: 'Я тебе люблю' },
  { lang: 'Serbian', text: 'Волим те' },
  { lang: 'Croatian', text: 'Volim te' },
  { lang: 'Slovenian', text: 'Ljubim te' },
  { lang: 'Albanian', text: 'Të dua' },
  { lang: 'Estonian', text: 'Ma armastan sind' },
  { lang: 'Latvian', text: 'Es tevi mīlu' },
  { lang: 'Lithuanian', text: 'Aš tave myliu' },
  { lang: 'Arabic', text: 'أحبك' },
  { lang: 'Persian', text: 'دوستت دارم' },
  { lang: 'Hindi', text: 'मैं तुमसे प्यार करता हूँ' },
  { lang: 'Urdu', text: 'میں تم سے پیار کرتا ہوں' },
  { lang: 'Bengali', text: 'আমি তোমাকে ভালোবাসি' },
  { lang: 'Punjabi', text: 'ਮੈਂ ਤੈਨੂੰ ਪਿਆਰ ਕਰਦਾ ਹਾਂ' },
  { lang: 'Tamil', text: 'நான் உன்னை காதலிக்கிறேன்' },
  { lang: 'Telugu', text: 'నేను నిన్ను ప్రేమిస్తున్నాను' },
  { lang: 'Marathi', text: 'मी तुझ्यावर प्रेम करतो' },
  { lang: 'Gujarati', text: 'હું તને પ્રેમ કરું છું' },
  { lang: 'Kannada', text: 'ನಾನು ನಿನ್ನನ್ನು ಪ್ರೀತಿಸುತ್ತೇನೆ' },
  { lang: 'Malayalam', text: 'ഞാൻ നിന്നെ സ്നേഹിക്കുന്നു' },
  { lang: 'Thai', text: 'ฉันรักคุณ' },
  { lang: 'Vietnamese', text: 'Tôi yêu bạn' },
  { lang: 'Indonesian', text: 'Aku cinta kamu' },
  { lang: 'Japanese', text: '愛してる' },
  { lang: 'Korean', text: '사랑해' },
  { lang: 'Chinese (Simplified)', text: '我爱你' },
]

const loveDrops = messages.map((message, index) => ({
  id: `love-${index}`,
  left: Math.random() * 100,
  delay: Math.random() * 5,
  duration: 8 + Math.random() * 8,
  size: 12 + Math.random() * 10,
  color: ['#ef4444', '#f472b6', '#a855f7'][Math.floor(Math.random() * 3)],
  opacity: 0.6 + Math.random() * 0.35,
  text: message.text,
}))

const restart = () => {
  accessStore.reset()
  router.push({ name: 'intro' })
}
</script>

<template>
  <main class="yay">
    <div class="hearts">
      <span
        v-for="heart in hearts"
        :key="heart.id"
        class="heart"
        :style="{
          left: `${heart.left}%`,
          animationDelay: `${heart.delay}s`,
          animationDuration: `${heart.duration}s`,
          fontSize: `${heart.size}px`,
          color: heart.color,
          opacity: heart.opacity,
        }"
      >
        ♥
      </span>
    </div>
    <section class="yay-card">
      <h1>YEEAAAY!!!</h1>
      <p class="subtitle">I love you very much</p>
      <p class="thanks">Thank you for playing, {{ playerName }} :)</p>
      <button class="button" @click="restart">Back to start</button>
    </section>
    <div class="love-rain">
      <span
        v-for="drop in loveDrops"
        :key="drop.id"
        class="love-drop"
        :style="{
          left: `${drop.left}%`,
          animationDelay: `${drop.delay}s`,
          animationDuration: `${drop.duration}s`,
          fontSize: `${drop.size}px`,
          color: drop.color,
          opacity: drop.opacity,
        }"
      >
        {{ drop.text }}
      </span>
    </div>
  </main>
</template>

<style scoped>
.yay {
  min-height: 100vh;
  background: #ffffff;
  display: grid;
  place-items: center;
  padding: 2.5rem 1.5rem;
  position: relative;
  overflow: hidden;
}

.yay-card {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 24px;
  padding: 2.5rem 2.75rem;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.2);
  max-width: min(520px, 90vw);
  text-align: center;
}

.yay-card h1 {
  font-family: "Playfair Display", "Georgia", serif;
  font-size: clamp(1.6rem, 4vw, 2.6rem);
  margin: 0 0 1rem;
  color: #0f172a;
  letter-spacing: 0.08rem;
}

.subtitle {
  margin: 0 0 1.5rem;
  color: #475569;
  font-weight: 600;
  letter-spacing: 0.08rem;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.thanks {
  margin: -0.8rem 0 1.6rem;
  color: #64748b;
  font-size: 0.9rem;
}

.hearts {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.heart {
  position: absolute;
  top: -10%;
  animation-name: heartFall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.love-rain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.love-drop {
  position: absolute;
  top: -10%;
  font-weight: 600;
  letter-spacing: 0.05rem;
  animation-name: loveFall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  text-shadow: 0 6px 14px rgba(248, 113, 113, 0.2);
}

@keyframes heartFall {
  0% {
    transform: translateY(-10vh);
  }
  100% {
    transform: translateY(110vh);
  }
}

@keyframes loveFall {
  0% {
    transform: translateY(-10vh);
  }
  100% {
    transform: translateY(110vh);
  }
}
</style>
