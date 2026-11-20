import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { areaLabels } from '@/data/labels';
import type { Area } from '@/types/Occurrence';
import { colors } from '@/theme/colors';

interface Props {
  area: Area;
  source: number | null;
  noSignal: boolean;
}

function VideoFeed({ source }: { source: number }) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });
  return <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />;
}

function NoSignal() {
  const offset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(offset, { toValue: 1, duration: 2400, easing: Easing.linear, useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [offset]);

  return (
    <View style={styles.fill}>
      <Animated.View
        style={[
          styles.scanline,
          { transform: [{ translateY: offset.interpolate({ inputRange: [0, 1], outputRange: [-10, 400] }) }] },
        ]}
      />
      <Text style={styles.noSignal}>SEM SINAL</Text>
      <Text style={styles.caption}>Falha de comunicação simulada</Text>
    </View>
  );
}

export function CameraFeed({ area, source, noSignal }: Props) {
  return (
    <View style={styles.container}>
      {noSignal ? (
        <NoSignal />
      ) : source !== null ? (
        <VideoFeed source={source} />
      ) : (
        <View style={styles.fill}>
          <Text style={styles.waiting}>AGUARDANDO FEED · {areaLabels[area].toUpperCase()}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFill, backgroundColor: colors.monitor, overflow: 'hidden' },
  fill: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', gap: 4 },
  waiting: { color: colors.textSecondary, fontSize: 12, letterSpacing: 1.5 },
  noSignal: { color: colors.textPrimary, fontSize: 18, fontWeight: '700', letterSpacing: 3 },
  caption: { color: colors.textSecondary, fontSize: 11 },
  scanline: { position: 'absolute', left: 0, right: 0, height: 10, backgroundColor: colors.scanline },
});
