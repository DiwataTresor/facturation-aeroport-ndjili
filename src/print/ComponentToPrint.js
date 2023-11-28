import React from 'react';
import Ticket from './Ticket';



export class ComponentToPrint extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state={
        partieImmatriculation:"",
        partieFacture:""
    };
    
  }
 componentDidMount() {
   
 }
 componentDidUpdate(){
   this.setState({partieFacture:this.props.numFact,partieImmatriculation:this.props.numFact});
   console.log();
 }
    render() {
      return (
        <>
          <Ticket />
        </>
      );
    }
  }