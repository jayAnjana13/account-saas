// import PropTypes from "prop-types";
import React from "react";
import Navigation from "../components/navbar/Navbar";

const AdminLayout = ({ children }) => {
  let common = (
    <React.Fragment>
      <Navigation />
    </React.Fragment>
  );

  let mainContainer = <React.Fragment>{children}</React.Fragment>;

  return (
    <React.Fragment>
      {common}
      {mainContainer}
    </React.Fragment>
  );
};
// AdminLayout.propTypes = {
//   children: PropTypes.node,
// };
export default AdminLayout;
