import { useEffect } from "react";
import { Autocomplete, Container, Grid, GridCol, Title } from "@mantine/core";
import PageHero from "../../components/PageHero";
import { TimelineDatePicker } from "./components/timeline/TimelineDatePicker";
import { DragDropContext, OnDragEndResponder } from "@hello-pangea/dnd";
import { useState } from "react";
import { DestinationItem, DestinationSuggestionItem, TimelineItem, exampleSuggestionData, exampleTimelineData } from "./types";
import { TimelineCards } from "./components/timeline/TimelineCards";
import { DestinationSuggestionDragArea } from "./components/explore/DestinationSuggestionDragArea";

/**
 * @typedef TimelineInterfaceData
 * @description State for all drag and drops
 * @property {TimelineItem[]} timelineData
 * @property {DestinationSuggestionItem[]} suggestionData
 */

interface TimelineInterfaceData {
  timelineData: TimelineItem[];
  suggestionData: DestinationSuggestionItem[];
}


const TripTimelineApp = () => {
  /** Set Page Title To "Trip Timeline" */
  useEffect(() => {
    document.title = "Trip Timeline";
  }, []);

  const [timelineInterfaceData, setTimelineInterfaceData] = useState<TimelineInterfaceData>({ timelineData: exampleTimelineData, suggestionData: exampleSuggestionData });

  const handleDragEnd: OnDragEndResponder = (result) => {
    const { source, destination } = result;

    // Check valid drag and drop? -> return
    if (!destination) {
      console.log("1");
      return;
    }

    // If move is not re-ordering -> return
    if (source.droppableId === destination.droppableId &&
      source.index === destination.index) {
      console.log("2");
      return;
    }

    // If move is within the suggestion list -> return
    if (source.droppableId === destination.droppableId && source.droppableId === "suggestion") {
      console.log("3");
      return;
    }

    // If move is within the same list (timeline), reorder that list
    if (source.droppableId === destination.droppableId) {
      console.log("4");
      // timeline list copied
      const timelineList = Array.from(timelineInterfaceData.timelineData);

      // re-order
      const [movedItem] = timelineList.splice(source.index, 1);
      timelineList.splice(destination.index, 0, movedItem);

      const newState: TimelineInterfaceData = {
        ...timelineInterfaceData,
        timelineData: timelineList,
      };

      setTimelineInterfaceData(newState);
      return;
    }

    // If move is from timeline to suggestion -> return
    if (source.droppableId === "timeline" && destination.droppableId === "suggestion") {
      console.log("5");
      return;
    }

    // move is from suggestion -> timeline

    const suggestionList = Array.from(timelineInterfaceData.suggestionData);
    const [movedItem] = suggestionList.splice(source.index, 1);

    const timelineList = Array.from(timelineInterfaceData.timelineData);

    // convert DestinationSuggestionItem to DestinationItem
    const destinationItem: DestinationItem = {
      id: movedItem.id,
      name: movedItem.name,
      description: movedItem.description,
      cost: null,
      startTime: null,
      duration: null,
    }

    timelineList.splice(destination.index, 0, destinationItem);

    const newState: TimelineInterfaceData = {
      timelineData: timelineList,
      suggestionData: suggestionList
    };

    setTimelineInterfaceData(newState);

    console.log("end");
    return;
  }

  return (
    <>
      <PageHero>
        Trip Timeline
      </PageHero>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid style={{position: "relative", top: "0.5em"}}>
          <Grid.Col span={6}>
            <Container ml="lg" maw="500px">
              <TimelineDatePicker />
              <TimelineCards timelineData={timelineInterfaceData.timelineData} />
            </Container>
          </Grid.Col>
          <GridCol span={6} bg={'#F4FCE3'}>
            <Container ml="lg" maw="500px">
              <Title order={3} mt={"lg"}>Search and Explore</Title>
              <Autocomplete
                placeholder="Grouse Mountain"
                mb={"lg"}
              />
              <DestinationSuggestionDragArea suggestionData={timelineInterfaceData.suggestionData} />
            </Container>
          </GridCol>
        </Grid>
      </DragDropContext>
    </>
  )
}

export default TripTimelineApp;
