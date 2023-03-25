import Spinner from "lib/spinner";
import Loader from "lib/loader2";
let Page = () => {
    return (
        <div className="center">
            <div className="qrbound">
                <div className="qr">
                    <div className="scale">
                        <Loader />
                    </div>
                </div>
            </div>
            <div className="text"> Updating QR</div>
        </div>
    );
};

export default Page;
