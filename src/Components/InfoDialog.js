import React from "react";
import Dialog from "@material-ui/core/Dialog/index";
import DialogTitle from "@material-ui/core/DialogTitle/index";
import {withStyles} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions/index";
import Button from "@material-ui/core/Button/index";
import Typography from "@material-ui/core/Typography/index";
import DialogContent from "@material-ui/core/DialogContent/index";

const styles = {};

class InfoDialog extends React.Component {
    handleClose = () => {
        this.props.onClose();
    };

    render() {
        const {classes, onClose, source, ...other} = this.props;
        return (
            <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" {...other}>
                <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                    {source.name}
                </DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        <div dangerouslySetInnerHTML={{__html: source.description}}/>
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">Done</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(InfoDialog);