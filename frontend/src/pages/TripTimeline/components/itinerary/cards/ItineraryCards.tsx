// /* eslint-disable @typescript-eslint/no-unused-vars */
// import cx from 'clsx';
// import { Flex, Text } from '@mantine/core';
// import { Droppable, Draggable } from '@hello-pangea/dnd';
// import classes from './DndList.module.css';
// import { Duration } from 'moment';
// import { IconPlaneInflight, IconTrain, IconCar, IconWalk, IconAB2, IconRoute, IconCoins, IconClock } from '@tabler/icons-react';
// import { DestinationItem, TimelineItem, TransportationItem, TransportationType, isDestinationItem } from '../../../types';
//
//
//
//
// /** getIconFromTransportationType
//  * @param {TransportationType} type
//  * @returns {JSX.Element}
//  */
// function getIconFromTransportationType(type: TransportationType): JSX.Element {
//     switch (type) {
//         case TransportationType.FLIGHT:
//             return <IconPlaneInflight />;
//         case TransportationType.TRANSIT:
//             return <IconTrain />;
//         case TransportationType.CAR:
//             return <IconCar />;
//         case TransportationType.WALK:
//             return <IconWalk />;
//         case TransportationType.OTHER:
//             return <IconAB2 />;
//     }
// }
//
// /** getTextFromTransportationType
//  * @param {TransportationType} type
//  * @param {Duration | null} duration
//  * @returns {string}
//  */
// function getTextFromTransportationType(type: TransportationType, duration: Duration | null): string {
//
//     let preText = "";
//
//     switch (type) {
//         case TransportationType.FLIGHT:
//             preText = 'Fly ';
//             break;
//         case TransportationType.TRANSIT:
//             preText = 'Transit ';
//             break;
//         case TransportationType.CAR:
//             preText = 'Drive ';
//             break;
//         case TransportationType.WALK:
//             preText = 'Walk ';
//             break;
//         case TransportationType.OTHER:
//             if (duration) {
//                 return "Get to next destination in " + duration.humanize();
//             } else {
//                 return "Get to next destination";
//             }
//     }
//
//     if (duration) {
//         return preText + "for " + duration.humanize();
//     } else {
//         return preText + "to next destination";
//     }
// }
//
//
// const dateOptions: Intl.DateTimeFormatOptions = {
//     hour: 'numeric',
//     minute: 'numeric',
//     hour12: true,
// };
//
// interface TimelineCardsProps {
//     timelineData: TimelineItem[];
// }
//
// export const TimelineCards = ({ timelineData }: TimelineCardsProps) => {
//
//     const AddTransportationBtn: React.FC = () => {
//         return (
//             <div className="relative">
//                 <div className="opacity-0 hover:opacity-100 w-full h-4 hover:h-16 transition-all duration-300 flex items-center justify-center">
//                     <IconRoute />
//                 </div>
//             </div>
//         );
//     };
//
//     const renderDestinationItem = (item: DestinationItem, index: number) => (
//         <>
//             {index != 0 && <AddTransportationBtn />}
//             <Text>{item.startTime?.toLocaleTimeString('en-US', dateOptions)}</Text>
//             <Draggable key={item.id} index={index} draggableId={item.id.toString()}>
//                 {(provided, snapshot) => (
//                     <div
//                         className={`${cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })} bg-slate-50`}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         ref={provided.innerRef}
//                     >
//                         <div>
//                             <Text>{item.name}</Text>
//                             <Text c="dimmed" size='sm' lineClamp={3}>{item.description}</Text>
//                             <Text c="dimmed" size="sm">
//                                 <Flex align="center">
//                                     <IconCoins size={16} />
//                                     <span className='mr-4' style={{ marginLeft: 4 }}>{item.cost?.amount} {item.cost?.currency}</span>
//                                     <IconClock size={16} />
//                                     <span style={{ marginLeft: 4 }}>{item.duration?.humanize()}</span>
//                                 </Flex>
//                             </Text>
//                         </div>
//                     </div>
//                 )}
//             </Draggable>
//         </>
//     );
//
//     const renderTransportationItemNew = (item: TransportationItem, index: number) => (
//         <>
//             <Draggable key={item.id} index={index} draggableId={item.id.toString()}>
//                 {(provided, snapshot) => (
//                     <div
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         ref={provided.innerRef}>
//
//                         {/** From Destination */}
//                         {index != 0 && <AddTransportationBtn />}
//                         <Text>{item.fromDestination.startTime?.toLocaleTimeString('en-US', dateOptions)}</Text>
//                         <div className={`${cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })} bg-slate-50`} >
//                             <div>
//                                 <Text>{item.fromDestination.name}</Text>
//                                 <Text c="dimmed" size='sm' lineClamp={3}>{item.fromDestination.description}</Text>
//                                 <Text c="dimmed" size="sm">
//                                     <Flex align="center">
//                                         <IconCoins size={16} />
//                                         <span className='mr-4' style={{ marginLeft: 4 }}>{item.fromDestination.cost?.amount} {item.fromDestination.cost?.currency}</span>
//                                         <IconClock size={16} />
//                                         <span style={{ marginLeft: 4 }}>{item.fromDestination.duration?.humanize()}</span>
//                                     </Flex>
//                                 </Text>
//                             </div>
//                         </div>
//
//                         {/** Transportation */}
//                         <div className='h-8'>
//                             <Text>{item.startTime?.toLocaleTimeString('en-US', dateOptions)}</Text>
//                         </div>
//                         <div className={`${cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}`} >
//                             <div>
//                                 <div className="mr-4">{getIconFromTransportationType(item.type)}</div>
//                                 <Text>{getTextFromTransportationType(item.type, item.duration)}</Text>
//                                 <Text c="dimmed" size='sm'>
//                                     <Flex align="center">
//                                         <IconCoins size={16} />
//                                         <span className='mr-4' style={{ marginLeft: 4 }}>{item.cost?.amount} {item.cost?.currency}</span>
//                                         <IconClock size={16} />
//                                         <span style={{ marginLeft: 4 }}>{item.duration?.humanize()}</span>
//                                     </Flex>
//                                 </Text>
//                             </div>
//                         </div>
//
//                         {/** To Destination */}
//                         <div className='h-8'>
//                             <Text>{item.toDestination.startTime?.toLocaleTimeString('en-US', dateOptions)}</Text>
//                         </div>
//                         <div className={`${cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })} bg-slate-50`} >
//                             <div>
//                                 <Text>{item.toDestination.name}</Text>
//                                 <Text c="dimmed" size='sm' lineClamp={3}>{item.toDestination.description}</Text>
//                                 <Text c="dimmed" size="sm">
//                                     <Flex align="center">
//                                         <IconCoins size={16} />
//                                         <span className='mr-4' style={{ marginLeft: 4 }}>{item.toDestination.cost?.amount} {item.toDestination.cost?.currency}</span>
//                                         <IconClock size={16} />
//                                         <span style={{ marginLeft: 4 }}>{item.toDestination.duration?.humanize()}</span>
//                                     </Flex>
//                                 </Text>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </Draggable>
//         </>
//     );
//
//
//     const items = timelineData.map((item: TimelineItem, index) => (
//
//
//         isDestinationItem(item) ? renderDestinationItem(item, index) : renderTransportationItemNew(item, index)
//
//     ));
//
//     return (
//
//
//         <Droppable droppableId="timeline" direction="vertical">
//             {(provided) => (
//                 <div {...provided.droppableProps} ref={provided.innerRef}>
//                     {items}
//                     {provided.placeholder}
//                 </div>
//             )}
//         </Droppable>
//
//     );
// }
