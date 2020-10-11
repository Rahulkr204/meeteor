/*global chrome*/

import React from 'react'
import { Box, Input, Button, Stack, Text, Checkbox, Icon, Tooltip, Code } from "@chakra-ui/core";
import {STORAGE_KEY} from '../utils/storage'
import '../css/index.css'

const MeetForm = props => {
    const [accountId, setAccountId] = React.useState(0);
    const [shouldCopy, setShouldCopy] = React.useState(true);
    const [showHelp, toggleHelp] = React.useState(false);
    const btnRef = React.createRef()

    const getFormData = async () => {
        chrome.storage.sync.get(STORAGE_KEY, function(items) {
            if (items && Object.keys(items).length) {
                const {accountId, shouldCopy} = items[STORAGE_KEY]
                setAccountId(accountId)
                setShouldCopy(shouldCopy)
            }
        });
    }

    React.useEffect(() => {
        getFormData()
        btnRef.current.focus()
    }, [])

    const gotoMeeting = async () => {
        const meetingDetails = { accountId, shouldCopy }
        chrome.storage.sync.set({[STORAGE_KEY]: meetingDetails}, function() {
            const meetingURL = `https://meet.google.com/new?authuser=${accountId}`
            window.open(meetingURL, "_blank")
        });
    }

    return (
        <Box h="85%" color="black" py="12px" px="4px">
            <Stack marginTop="16px">
                <Box marginY="4px" d="flex" alignItems="center">
                    <Label value={`Account Id`}/>
                    <Input bg="gray.100" marginX="4px" size="sm" value={accountId} onChange={e => setAccountId(e.target.value)} placeholder="Enter account id" />
                    <Icon color="teal.500" marginLeft="4px" cursor="pointer" name="question-outline" onClick={() => toggleHelp(!showHelp)} />
                </Box>
                {showHelp && <UserIdHelp/>}
                <Checkbox isChecked={shouldCopy} onChange={e => {
                    setShouldCopy(e.target.checked)}} size="md" variantColor="teal" color="gray.100" marginY="4px">
                    Copy to Clipboard
                </Checkbox>
            </Stack>
            <Box marginTop="16px">
                <Button h="32px" ref={btnRef} onClick={() => gotoMeeting()} w="100%" variantColor="teal">Join Meeting <span className="btnDescription">(Press ⏎)</span> </Button>
            </Box>
        </Box>
    )
}

const Label = props => {
    return (
        <Box d="flex" alignItems="center" marginRight="8px">
            <Text color="white" fontSize="md" width="96px">{props.value}</Text>
        </Box>
    )
}

const UserIdHelp = () => {
    return (
        <Box bg="gray.600" d="flex" flexDir="column" borderRadius="2px" textAlign="center" p="2px" my="8px">
            <Text fontSize="10px" color="gray.100">You can get account id from url such as below</Text>
            <Code fontSize="8px" variantColor="gray.700" color="gray.50" children={<p> https://meet.google.com/{<strong>meeting_id</strong>}?authuser={<strong>user_id</strong>}</p>} />
        </Box>
    )
}

export default MeetForm