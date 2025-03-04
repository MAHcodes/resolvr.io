"use client";

import { Fragment, useEffect } from "react";

import { useRelayInfoStore } from "@/app/stores/relayInfoStore";
import { useRelayMenuStore } from "@/app/stores/relayMenuStore";
import { useRelayStore } from "@/app/stores/relayStore";
import { Dialog, Transition } from "@headlessui/react";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

import PostRelayCards from "./PostRelayCards";
import ReadRelayCards from "./ReadRelayCards";
import RelayDiscover from "./RelayDiscover";
import RelaySettings from "./RelaySettings";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function RelayMenu() {
  const {
    RelayMenuTabs,
    relayMenuActiveTab,
    relayMenuIsOpen,
    setRelayMenuActiveTab,
    setRelayMenuIsOpen,
  } = useRelayMenuStore();

  const { allRelays } = useRelayStore();

  const { addRelayInfo, getRelayInfo } = useRelayInfoStore();

  // TODO: get and store relay info for all relays eventually use relay list here

  // TODO: add refresh button

  useEffect(() => {
    allRelays.forEach((relayUrl) => {
      const cachedRelayInfo = getRelayInfo(relayUrl);
      let relayHttpUrl = relayUrl.replace("wss://", "https://");
      if (cachedRelayInfo === undefined) {
        console.log("Fetching relay info:", relayHttpUrl);
        const getRelayInfo = async (url: string) => {
          try {
            const response = await fetch(url, {
              headers: {
                Accept: "application/nostr+json",
              },
            });
            const data = await response.json();
            // data.url = relayUrl;
            addRelayInfo(relayUrl, data);
          } catch (error) {
            console.log("Error fetching relay info:", relayHttpUrl);
            console.error(`Error fetching relay information: ${error}`);
          }
        };
        getRelayInfo(relayHttpUrl);
      } else {
        // console.log("Cached relay info:", cachedRelayInfo);
      }
    });
  }, [addRelayInfo, getRelayInfo]);

  return (
    <Transition.Root show={relayMenuIsOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setRelayMenuIsOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl dark:bg-gray-800">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-2 items-center">
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">
                            Relays
                          </Dialog.Title>
                          <InformationCircleIcon
                            className="cursor-pointer text-gray-400 h-5 w-5"
                            aria-hidden="true"
                          />
                        </div>

                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
                            onClick={() => setRelayMenuIsOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700">
                      <div className="px-6">
                        <nav
                          className="-mb-px flex space-x-6"
                          x-descriptions="Tab component"
                        >
                          {RelayMenuTabs.map((tab) => (
                            <button
                              key={tab}
                              className={classNames(
                                relayMenuActiveTab === tab
                                  ? "border-indigo-300 text-indigo-400 dark:border-indigo-500 dark:text-indigo-400"
                                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-300 dark:hover:text-gray-200",
                                "whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium",
                              )}
                              onClick={(e) => {
                                e.preventDefault();
                                setRelayMenuActiveTab(tab);
                              }}
                            >
                              {tab}
                            </button>
                          ))}
                        </nav>
                      </div>
                    </div>
                    {relayMenuActiveTab === "Read From" && <ReadRelayCards />}
                    {relayMenuActiveTab === "Post To" && <PostRelayCards />}
                    {relayMenuActiveTab === "Settings" && <RelaySettings />}
                    {relayMenuActiveTab === "Discover" && <RelayDiscover />}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
