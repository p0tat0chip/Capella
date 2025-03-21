import {
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionTrigger,
    AccordionTitleText,
    AccordionContent,
    AccordionContentText,
    AccordionIcon,
} from '@/components/ui/accordion';
import { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import {View, Button, Text, SafeAreaView} from "react-native";
import {ChevronDownIcon, ChevronUpIcon} from "lucide-react-native";


const SupportPage = () => {
    return (
        <SafeAreaView>
            <Accordion
                size="md"
                variant="filled"
                type="single"
                isCollapsible={true}
                isDisabled={false}
                className="m-5 w-[90%] border border-outline-200"
            >
                <AccordionItem value="a">
                    <AccordionHeader>
                        <AccordionTrigger>
                            {({ isExpanded }) => {
                                return (
                                    <>
                                        <AccordionTitleText>
                                            How can I get a refund?
                                        </AccordionTitleText>
                                        {isExpanded ? (
                                            <AccordionIcon as={ChevronUpIcon} className="ml-3" />
                                        ) : (
                                            <AccordionIcon as={ChevronDownIcon} className="ml-3" />
                                        )}
                                    </>
                                )
                            }}
                        </AccordionTrigger>
                    </AccordionHeader>
                    <AccordionContent>
                        <AccordionContentText>
                            Bhag jaa
                        </AccordionContentText>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="b">
                    <AccordionHeader>
                        <AccordionTrigger>
                            {({ isExpanded }) => {
                                return (
                                    <>
                                        <AccordionTitleText>
                                            What payment methods do you accept?
                                        </AccordionTitleText>
                                        {isExpanded ? (
                                            <AccordionIcon as={ChevronUpIcon} className="ml-3" />
                                        ) : (
                                            <AccordionIcon as={ChevronDownIcon} className="ml-3" />
                                        )}
                                    </>
                                )
                            }}
                        </AccordionTrigger>
                    </AccordionHeader>
                    <AccordionContent>
                        <AccordionContentText>
                            We accept all major credit cards, including Visa, Mastercard, and
                            American Express. We also support payments through PayPal.
                        </AccordionContentText>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </SafeAreaView>
    )
}


export default SupportPage;