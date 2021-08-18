import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import "core-js/fn/symbol/iterator";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  Easing,
} from "react-native-reanimated";

interface Option {
  name: string;
  beat: string;
  emoji: string;
}

interface Summary {
  player: string;
  playerEmoji: string;
  com: string;
  comEmoji: string;
  winner: string;
}

const Options: Option[] = [
  { name: "rock", beat: "scissors", emoji: "✊🏼" },
  { name: "paper", beat: "rock", emoji: "🖐🏼" },
  { name: "scissors", beat: "paper", emoji: "✌🏼" },
];

export default function App(): JSX.Element {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [result, setResult] = useState<string>("Pick!");
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [comScore, setComScore] = useState<number>(0);
  const [shaking, setShaking] = useState<boolean>(false);
  const [colorText, setColorText] = useState<string>("white");

  const opacity: Animated.SharedValue<number> = useSharedValue(0);
  const scale: Animated.SharedValue<number> = useSharedValue(5);
  const translate: Animated.SharedValue<number> = useSharedValue(0);
  const textScale: Animated.SharedValue<number> = useSharedValue(1);
  const emojiChoicesScale: Animated.SharedValue<number> = useSharedValue(1);

  const winnerDeterminer = (comPick: Option, playerPick: Option): string => {
    setShaking(true);
    translate.value = withRepeat(withTiming(20), 4, true);
    emojiChoicesScale.value = withRepeat(
      withTiming(0.9, {
        duration: 100,
      }),
      2,
      true
    );
    setTimeout(() => {
      let result: string;
      if (
        comPick.beat === playerPick.name &&
        comPick.name !== playerPick.name
      ) {
        //translate.value = withTiming(0, { duration: 1000 });
        setComScore(comScore + 1);
        setColorText("#e66767");
        setResult(`You Lose`);
        setShaking(false);
        result = "com";
      } else if (
        comPick.beat !== playerPick.name &&
        comPick.name !== playerPick.name
      ) {
        setPlayerScore(playerScore + 1);
        setColorText("#fada70");
        setResult(`You Win!`);
        setShaking(false);
        result = "player";
      } else {
        //translate.value = withTiming(0, { duration: 1000 });
        setResult("Tie");
        setColorText("white");
        setShaking(false);
        result = "tie";
      }
      textScale.value = withRepeat(withTiming(1.4, { duration: 150 }), 2, true);
    }, 1200);

    return result;
  };

  const pickHandler = (playerNum: number): void => {
    const comPick: Option = Options[Math.floor(Math.random() * Options.length)];
    const playerPick: Option = Options[playerNum];
    const currentMatchHistory = {
      player: playerPick.name,
      playerEmoji: playerPick.emoji,
      com: comPick.name,
      comEmoji: comPick.emoji,
      winner: winnerDeterminer(comPick, playerPick),
    };

    const newHistory = currentMatchHistory;

    setSummary(newHistory);
  };

  const ContainerAnimations = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  }, []);

  const ResultAnimations = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translate.value }],
    };
  }, []);

  const ResultTextAnimations = useAnimatedStyle(() => {
    return {
      transform: [{ scale: textScale.value }],
    };
  }, []);

  const EmojiContainerAnimations = useAnimatedStyle(() => {
    return {
      transform: [{ scale: emojiChoicesScale.value }],
    };
  }, []);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 });
    scale.value = withSpring(1);
    translate.value = 0;
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.container, ContainerAnimations]}>
        <View style={styles.resultContainer}>
          <View style={styles.resultItem}>
            <Text style={styles.scoreText}>YOU: {playerScore}</Text>
          </View>

          <View style={styles.resultItem}>
            <Text style={styles.scoreText}>COM: {comScore}</Text>
          </View>
        </View>

        <View style={styles.summaryContainer}>
          <Animated.View style={[ResultAnimations]}>
            {shaking ? (
              <Text style={styles.summaryEmojiText}>🤜🏻🤛🏻</Text>
            ) : summary ? (
              <View style={styles.summaryEmojiContainer}>
                <View style={styles.summaryEmojiItem}>
                  <Text style={styles.summaryEmojiText}>
                    {summary.playerEmoji}
                  </Text>
                </View>
                <View style={styles.summaryEmojiItem}>
                  <Text style={styles.summaryEmojiText}>
                    {summary.comEmoji}
                  </Text>
                </View>
              </View>
            ) : null}
          </Animated.View>
        </View>

        <Animated.View style={ResultTextAnimations}>
          <Text
            style={[
              styles.resultText,
              { color: shaking ? "white" : colorText },
            ]}
          >
            {shaking ? "Shaking.." : result}
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.choicesContainer,
            { opacity: shaking ? 0.5 : 1 },
            EmojiContainerAnimations,
          ]}
        >
          <TouchableOpacity
            style={styles.choiceContainer}
            onPress={shaking ? null : () => pickHandler(0)}
          >
            <Text style={[styles.optionText, { opacity: shaking ? 0.5 : 1 }]}>
              ✊🏼
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.choiceContainer}
            onPress={shaking ? null : () => pickHandler(1)}
          >
            <Text style={[styles.optionText, { opacity: shaking ? 0.5 : 1 }]}>
              🖐🏼
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.choiceContainer}
            onPress={shaking ? null : () => pickHandler(2)}
          >
            <Text style={[styles.optionText, { opacity: shaking ? 0.5 : 1 }]}>
              ✌🏼
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <StatusBar style="auto" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#203b63",
    alignItems: "center",
    justifyContent: "center",
  },
  choicesContainer: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "gray",
    padding: 5,
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  choiceContainer: {
    marginHorizontal: 10,
  },
  optionText: {
    fontSize: 50,
  },
  resultContainer: {
    flexDirection: "row",
    marginBottom: 25,
  },
  resultItem: {
    marginHorizontal: 15,
  },
  summaryContainer: {
    //width: "100%",
    marginBottom: 15,
  },
  summaryEmojiContainer: {
    flexDirection: "row",
  },
  summaryEmojiItem: {
    marginHorizontal: 15,
  },
  summaryEmojiText: {
    fontSize: 50,
    opacity: 1,
  },
  scoreText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    opacity: 0.9,
  },
  resultText: {
    fontWeight: "500",
    marginBottom: 25,
    fontSize: 16,
  },
});
