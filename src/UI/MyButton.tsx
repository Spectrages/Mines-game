import React, {FC, ReactNode} from 'react';
import './MyButton.css'

interface Props {
    children: ReactNode;
    onClick: () => void;

}

const MyButton: FC<Props> = ({children, ...props}) => {

    return (
        <button className="MyButton" {...props}>
            {children}
        </button>
    );
};



export default MyButton;