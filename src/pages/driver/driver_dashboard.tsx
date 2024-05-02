import { useEffect, useState } from 'react';
import { gql, useMutation, useSubscription } from '@apollo/client';
import { FULL_ORDER_FRAGMENT } from '../../fragments';
import GoogleMapReact from "google-map-react";
import { CoockedOrdersSubscription, CoockedOrdersSubscriptionVariables, TakeOrderMutation, TakeOrderMutationVariables } from '../../__api__/graphql';
import { useNavigate } from 'react-router-dom';

const COOCKED_ORDERS_SUBSCRIPTION = gql`
  subscription coockedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

interface ICoords {
    lat: number;
    lng: number;
}

interface IDriverProps {
    lat: number;
    lng: number;
    $hover?: any;
}
const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🛵</div>;

export const DriverDashboard = () => {
    const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 });
    const [map, setMap] = useState<google.maps.Map>();
    const [maps, setMaps] = useState<any>();
    const onSuccess = ({ coords: { latitude, longitude } }: GeolocationPosition) => {
        setDriverCoords({ lat: latitude, lng: longitude });
    };
    const onError = (error: GeolocationPositionError) => {
        console.log(error);
    };
    useEffect(() => {
        navigator.geolocation.watchPosition(onSuccess, onError, {
            enableHighAccuracy: true,
        });
    }, []);

    useEffect(() => {
        if (map && maps) {
            map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode(
                {
                    location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
                },
                (results, status) => {
                    console.log(status, results);
                }
            );
        }
    }, [driverCoords.lat, driverCoords.lng]);
    const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
        map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
        setMap(map);
        setMaps(maps);
    };
    const makeRoute = () => {
        if (map) {
            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);
            directionsService.route(
                {
                    origin: {
                        location: new google.maps.LatLng(
                            driverCoords.lat,
                            driverCoords.lng
                        ),
                    },
                    destination: {
                        location: new google.maps.LatLng(
                            driverCoords.lat + 0.05,
                            driverCoords.lng + 0.05
                        ),
                    },
                    travelMode: google.maps.TravelMode.TRANSIT,
                },
                (result) => {
                    directionsRenderer.setDirections(result);
                }
            );
        }
    };

    const { data: coockedOrdersData } = useSubscription<
        CoockedOrdersSubscription,
        CoockedOrdersSubscriptionVariables
    >(COOCKED_ORDERS_SUBSCRIPTION);
    useEffect(() => {
        //TODO: 배달원에게 배달경로 미리보기
        if (coockedOrdersData?.cookedOrders.id) {
            makeRoute();
        }
    }, [coockedOrdersData]);

    const navigate = useNavigate();
    const onCompleted = (data: TakeOrderMutation) => {
        if (data.takeOrder.ok) {
            navigate(`/order/${coockedOrdersData?.cookedOrders.id}`);
        }
    };

    const [takeOrderMutation] = useMutation<
        TakeOrderMutation,
        TakeOrderMutationVariables
    >(TAKE_ORDER_MUTATION, { onCompleted });
    const triggerMutation = (orderId: number) => {
        takeOrderMutation({
            variables: {
                input: {
                    id: orderId,
                },
            },
        });
    };
    return (
        <div>
            <div
                className='orverflow-hidden'
                style={{ width: window.innerWidth, height: "50vh" }}
            >
                <GoogleMapReact
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={onApiLoaded}
                    defaultZoom={15}
                    defaultCenter={{ lat: driverCoords.lat, lng: driverCoords.lng }}
                    bootstrapURLKeys={{ key: "AIzaSyCQ_2PQ579FIVAMCu9uRxtEoby1pUgerrk" }}
                >
                    <Driver lat={driverCoords.lat} lng={driverCoords.lng}></Driver>
                </GoogleMapReact>
            </div>
            <div className=" max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
                {coockedOrdersData?.cookedOrders.restaurant ? (
                    <>
                        <h1 className="text-center  text-3xl font-medium">
                            새 조리 주문
                        </h1>
                        <h1 className="text-center my-3 text-2xl font-medium">
                            곧 픽업 합니다. @{" "}
                            {coockedOrdersData?.cookedOrders.restaurant?.name}
                        </h1>
                        <button
                            onClick={() =>
                                triggerMutation(coockedOrdersData?.cookedOrders.id)
                            }
                            className="btn w-full bg-sky-500 hover:bg-sky-600 block  text-center mt-5"
                        >
                            배달 수락
                        </button>
                    </>
                ) : (
                    <h1 className="text-center  text-3xl font-medium">
                        아직 주문이 없습니다.
                    </h1>
                )}
            </div>
        </div>
    )
};