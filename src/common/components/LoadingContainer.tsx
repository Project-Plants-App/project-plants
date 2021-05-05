import {ChildrenProp} from "@ui-kitten/components/devsupport";
import React from "react";
import {Modal, Spinner} from "@ui-kitten/components";

type LoadingContainerProps = {
    loading: boolean;
    children: ChildrenProp
};

export default ({loading, children}: LoadingContainerProps) => {

    return (
        <React.Fragment>
            {children}
            <Modal
                visible={loading}
                backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.75)'}}>
                <Spinner size="giant" status="basic"/>
            </Modal>
        </React.Fragment>
    );

}