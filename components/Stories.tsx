import { STORIES } from "@/constants/mock-data";
import { ScrollView } from "react-native";
import Story from "./Story";
import { styles } from "@/styles/feed.styles";

const StoriesSection = () => (
  <ScrollView horizontal showsVerticalScrollIndicator={false} style={styles.storiesContainer}>
    {
      STORIES.map((story) => (
        <Story key={story.id} story={story} />
      ))
    }
  </ScrollView>
)

export default StoriesSection