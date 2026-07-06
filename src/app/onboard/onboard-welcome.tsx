import { router } from 'expo-router';
import { MotiView } from 'moti';
import { FC, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Icon, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import useAppTheme from '@/hooks/use-app-theme';
import useFirstLaunch from '@/hooks/use-first-launch';

const STEPS = [
  {
    icon: 'home-heart',
    title: 'Bem-vindo(a) ao Bairro!',
    description:
      'Seu bairro nunca foi tão conectado! Aqui você descobre o melhor da sua comunidade local — tudo em um só lugar.',
    action: 'Próximo',
  },
  {
    icon: 'tag-heart',
    title: 'Ofertas incríveis perto de você!',
    description:
      'Promoções e descontos exclusivos dos melhores comércios e serviços do seu bairro. Economize todo dia apoiando quem está do seu lado!',
    action: 'Próximo',
  },
  {
    icon: 'rocket-launch',
    title: 'O que está esperando?',
    description:
      'Aproveite já as ofertas do seu bairro e faça parte dessa comunidade incrível que está crescendo a cada dia!',
    action: 'Começar agora!',
  },
] as const;

interface StepDotsProps {
  total: number;
  current: number;
}

const StepDots: FC<StepDotsProps> = ({ total, current }) => {
  const theme = useAppTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            height: 8,
            borderRadius: 4,
            width: i === current ? 24 : 8,
            backgroundColor:
              i === current ? theme.colors.primary : theme.colors.outline,
          }}
        />
      ))}
    </View>
  );
};

const OnboardWelcome: FC = () => {
  const theme = useAppTheme();
  const { markLaunched } = useFirstLaunch();
  const [step, setStep] = useState(0);

  useEffect(() => {
    markLaunched();
  }, [markLaunched]);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      router.replace('/(tabs)/place/place-list');
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 24 }}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <MotiView
          key={step}
          from={{ opacity: 0, translateX: 40 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 350 }}
          style={{ alignItems: 'center', gap: 28 }}
        >
          <Icon source={current.icon} size={120} color={theme.colors.primary} />
          <Text
            variant="headlineMedium"
            style={{ fontWeight: 'bold', textAlign: 'center' }}
          >
            {current.title}
          </Text>
          <Text
            variant="bodyLarge"
            style={{
              textAlign: 'center',
              color: theme.colors.onSurfaceVariant,
              lineHeight: 26,
            }}
          >
            {current.description}
          </Text>
        </MotiView>
      </View>

      <View style={{ gap: 24, paddingBottom: 16 }}>
        <StepDots total={STEPS.length} current={step} />
        <Button
          mode="contained"
          onPress={handleNext}
          labelStyle={{ fontSize: 16 }}
        >
          {current.action}
        </Button>
        {!isLast && (
          <Button
            onPress={() => router.replace('/(tabs)/place/place-list')}
            labelStyle={{ fontSize: 14 }}
          >
            Pular
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OnboardWelcome;
