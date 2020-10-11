/*global chrome*/

import React from "react";
import {
  Box,
  Input,
  Button,
  Stack,
  Text,
  Checkbox,
  Icon,
  Code
} from "@chakra-ui/core";
import { STORAGE_KEY } from "../utils/storage";
import "../css/index.css";

const MeetForm = (props) => {
  const [showHelp, toggleHelp] = React.useState(false);
  const [formData, setFormData] = React.useState({
    accountId: 0,
    shouldCopy: true,
    mute: true,
    disableVideo: true
  });

  const btnRef = React.createRef();

  const updateFormData = (params) => {
    let state = formData;
    Object.keys(params).forEach((i) => {
      state = { ...state, [i]: params[i] };
    });
    chrome.storage.sync.set({ [STORAGE_KEY]: state }, function () {
      setFormData(state);
    });
  };

  const getFormData = async () => {
    chrome.storage.sync.get(STORAGE_KEY, function (items) {
      if (items && Object.keys(items).length) {
        setFormData(items[STORAGE_KEY]);
      }
    });
  };

  React.useEffect(() => {
    getFormData();
    btnRef.current.focus();
  }, []);

  const gotoMeeting = async () => {
    // const meetingDetails = { accountId, shouldCopy };
    chrome.storage.sync.set({ [STORAGE_KEY]: formData }, function () {
      const meetingURL = `https://meet.google.com/new?authuser=${formData.accountId}`;
      window.open(meetingURL, "_blank");
    });
  };

  return (
    <Box h="85%" color="black" py="12px" px="4px">
      <Stack marginTop="16px">
        <Box marginY="4px" d="flex" alignItems="center">
          <Label value={`Account Id`} />
          <Input
            bg="gray.100"
            marginX="4px"
            size="sm"
            value={formData.accountId}
            onChange={(e) => updateFormData({ accountId: e.target.value })}
            placeholder="Enter account id"
          />
          <Icon
            color="teal.500"
            marginLeft="4px"
            cursor="pointer"
            name="question-outline"
            onClick={() => toggleHelp(!showHelp)}
          />
        </Box>
        {showHelp && <UserIdHelp />}
        <Checkbox
          isChecked={formData.shouldCopy}
          onChange={(e) => {
            updateFormData({ shouldCopy: e.target.checked });
          }}
          size="sm"
          variantColor="teal"
          color="gray.100"
          marginY="4px"
        >
          Copy to Clipboard
        </Checkbox>

        <Checkbox
          isChecked={formData.mute}
          onChange={(e) => {
            updateFormData({ mute: e.target.checked });
          }}
          size="sm"
          variantColor="teal"
          color="gray.100"
          marginY="4px"
        >
          Disable Audio
        </Checkbox>

        <Checkbox
          isChecked={formData.disableVideo}
          onChange={(e) => {
            updateFormData({ disableVideo: e.target.checked });
          }}
          size="sm"
          variantColor="teal"
          color="gray.100"
          marginY="4px"
        >
          Disable Video
        </Checkbox>
      </Stack>
      <Box marginTop="16px">
        <Button
          h="32px"
          ref={btnRef}
          onClick={() => gotoMeeting()}
          w="100%"
          variantColor="teal"
        >
          Join Meeting <span className="btnDescription">(Press ⏎)</span>{" "}
        </Button>
      </Box>
    </Box>
  );
};

const Label = (props) => {
  return (
    <Box d="flex" alignItems="center" marginRight="8px">
      <Text color="white" fontSize="md" width="96px">
        {props.value}
      </Text>
    </Box>
  );
};

const UserIdHelp = () => {
  return (
    <Box
      bg="gray.600"
      d="flex"
      flexDir="column"
      borderRadius="2px"
      textAlign="center"
      p="2px"
      my="8px"
    >
      <Text fontSize="10px" color="gray.100">
        You can get account id from url such as below
      </Text>
      <Code
        fontSize="8px"
        variantColor="gray.700"
        color="gray.100"
        children={
          <p>
            {" "}
            https://meet.google.com/{<strong>meeting_id</strong>}?authuser=
            {<strong>user_id</strong>}
          </p>
        }
      />
    </Box>
  );
};

export default MeetForm;
