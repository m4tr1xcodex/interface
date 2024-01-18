import {
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter,
    Button,
    useDisclosure,
    Input
  } from "@nextui-org/react";
import React, { useState } from "react";
export const NewGroupFromFile = () => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [data, setData] = useState(null);

    const changeFile = (e:any) => {
        console.log(e.target.files[0]);
    }

    return <>
        <Button onPress={onOpen}>Cargar desde archivo</Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" placement="center">
            <ModalContent>
            {(onClose) => (
                <>
                <ModalHeader className="flex flex-col gap-1">Cargar grupos desde archivo excel</ModalHeader>
                <ModalBody>
                    <div>
                        <Input type="file" onChange={changeFile} />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                    Close
                    </Button>
                    <Button color="primary" onPress={onClose}>
                    Cargar
                    </Button>
                </ModalFooter>
                </>
            )}
            </ModalContent>
        </Modal>
    </>;
}