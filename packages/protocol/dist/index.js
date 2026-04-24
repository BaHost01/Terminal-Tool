/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import $protobuf from "protobufjs";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = ($protobuf.roots && $protobuf.roots["default"]) || {};

export const terminal = $root.terminal = (() => {

    /**
     * Namespace terminal.
     * @exports terminal
     * @namespace
     */
    const terminal = {};

    terminal.ClientMessage = (function() {

        /**
         * Properties of a ClientMessage.
         * @memberof terminal
         * @interface IClientMessage
         * @property {terminal.IAuthRequest|null} [authRequest] ClientMessage authRequest
         * @property {terminal.IRegisterHostRequest|null} [registerHost] ClientMessage registerHost
         * @property {terminal.IPtyInput|null} [ptyInput] ClientMessage ptyInput
         * @property {terminal.IPtyResize|null} [ptyResize] ClientMessage ptyResize
         * @property {terminal.IToggleScreenRequest|null} [toggleScreen] ClientMessage toggleScreen
         * @property {terminal.IToggleAdminRequest|null} [toggleAdmin] ClientMessage toggleAdmin
         * @property {string|null} [clientId] ClientMessage clientId
         */

        /**
         * Constructs a new ClientMessage.
         * @memberof terminal
         * @classdesc Represents a ClientMessage.
         * @implements IClientMessage
         * @constructor
         * @param {terminal.IClientMessage=} [properties] Properties to set
         */
        function ClientMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ClientMessage authRequest.
         * @member {terminal.IAuthRequest|null|undefined} authRequest
         * @memberof terminal.ClientMessage
         * @instance
         */
        ClientMessage.prototype.authRequest = null;

        /**
         * ClientMessage registerHost.
         * @member {terminal.IRegisterHostRequest|null|undefined} registerHost
         * @memberof terminal.ClientMessage
         * @instance
         */
        ClientMessage.prototype.registerHost = null;

        /**
         * ClientMessage ptyInput.
         * @member {terminal.IPtyInput|null|undefined} ptyInput
         * @memberof terminal.ClientMessage
         * @instance
         */
        ClientMessage.prototype.ptyInput = null;

        /**
         * ClientMessage ptyResize.
         * @member {terminal.IPtyResize|null|undefined} ptyResize
         * @memberof terminal.ClientMessage
         * @instance
         */
        ClientMessage.prototype.ptyResize = null;

        /**
         * ClientMessage toggleScreen.
         * @member {terminal.IToggleScreenRequest|null|undefined} toggleScreen
         * @memberof terminal.ClientMessage
         * @instance
         */
        ClientMessage.prototype.toggleScreen = null;

        /**
         * ClientMessage toggleAdmin.
         * @member {terminal.IToggleAdminRequest|null|undefined} toggleAdmin
         * @memberof terminal.ClientMessage
         * @instance
         */
        ClientMessage.prototype.toggleAdmin = null;

        /**
         * ClientMessage clientId.
         * @member {string} clientId
         * @memberof terminal.ClientMessage
         * @instance
         */
        ClientMessage.prototype.clientId = "";

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * ClientMessage payload.
         * @member {"authRequest"|"registerHost"|"ptyInput"|"ptyResize"|"toggleScreen"|"toggleAdmin"|undefined} payload
         * @memberof terminal.ClientMessage
         * @instance
         */
        Object.defineProperty(ClientMessage.prototype, "payload", {
            get: $util.oneOfGetter($oneOfFields = ["authRequest", "registerHost", "ptyInput", "ptyResize", "toggleScreen", "toggleAdmin"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new ClientMessage instance using the specified properties.
         * @function create
         * @memberof terminal.ClientMessage
         * @static
         * @param {terminal.IClientMessage=} [properties] Properties to set
         * @returns {terminal.ClientMessage} ClientMessage instance
         */
        ClientMessage.create = function create(properties) {
            return new ClientMessage(properties);
        };

        /**
         * Encodes the specified ClientMessage message. Does not implicitly {@link terminal.ClientMessage.verify|verify} messages.
         * @function encode
         * @memberof terminal.ClientMessage
         * @static
         * @param {terminal.IClientMessage} message ClientMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ClientMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.authRequest != null && Object.hasOwnProperty.call(message, "authRequest"))
                $root.terminal.AuthRequest.encode(message.authRequest, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.registerHost != null && Object.hasOwnProperty.call(message, "registerHost"))
                $root.terminal.RegisterHostRequest.encode(message.registerHost, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.ptyInput != null && Object.hasOwnProperty.call(message, "ptyInput"))
                $root.terminal.PtyInput.encode(message.ptyInput, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.ptyResize != null && Object.hasOwnProperty.call(message, "ptyResize"))
                $root.terminal.PtyResize.encode(message.ptyResize, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.toggleScreen != null && Object.hasOwnProperty.call(message, "toggleScreen"))
                $root.terminal.ToggleScreenRequest.encode(message.toggleScreen, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.toggleAdmin != null && Object.hasOwnProperty.call(message, "toggleAdmin"))
                $root.terminal.ToggleAdminRequest.encode(message.toggleAdmin, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.clientId != null && Object.hasOwnProperty.call(message, "clientId"))
                writer.uint32(/* id 10, wireType 2 =*/82).string(message.clientId);
            return writer;
        };

        /**
         * Encodes the specified ClientMessage message, length delimited. Does not implicitly {@link terminal.ClientMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof terminal.ClientMessage
         * @static
         * @param {terminal.IClientMessage} message ClientMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ClientMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ClientMessage message from the specified reader or buffer.
         * @function decode
         * @memberof terminal.ClientMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {terminal.ClientMessage} ClientMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ClientMessage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.terminal.ClientMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.authRequest = $root.terminal.AuthRequest.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.registerHost = $root.terminal.RegisterHostRequest.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.ptyInput = $root.terminal.PtyInput.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.ptyResize = $root.terminal.PtyResize.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.toggleScreen = $root.terminal.ToggleScreenRequest.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.toggleAdmin = $root.terminal.ToggleAdminRequest.decode(reader, reader.uint32());
                        break;
                    }
                case 10: {
                        message.clientId = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ClientMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof terminal.ClientMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {terminal.ClientMessage} ClientMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ClientMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ClientMessage message.
         * @function verify
         * @memberof terminal.ClientMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ClientMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.authRequest != null && message.hasOwnProperty("authRequest")) {
                properties.payload = 1;
                {
                    let error = $root.terminal.AuthRequest.verify(message.authRequest);
                    if (error)
                        return "authRequest." + error;
                }
            }
            if (message.registerHost != null && message.hasOwnProperty("registerHost")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    let error = $root.terminal.RegisterHostRequest.verify(message.registerHost);
                    if (error)
                        return "registerHost." + error;
                }
            }
            if (message.ptyInput != null && message.hasOwnProperty("ptyInput")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    let error = $root.terminal.PtyInput.verify(message.ptyInput);
                    if (error)
                        return "ptyInput." + error;
                }
            }
            if (message.ptyResize != null && message.hasOwnProperty("ptyResize")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    let error = $root.terminal.PtyResize.verify(message.ptyResize);
                    if (error)
                        return "ptyResize." + error;
                }
            }
            if (message.toggleScreen != null && message.hasOwnProperty("toggleScreen")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    let error = $root.terminal.ToggleScreenRequest.verify(message.toggleScreen);
                    if (error)
                        return "toggleScreen." + error;
                }
            }
            if (message.toggleAdmin != null && message.hasOwnProperty("toggleAdmin")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    let error = $root.terminal.ToggleAdminRequest.verify(message.toggleAdmin);
                    if (error)
                        return "toggleAdmin." + error;
                }
            }
            if (message.clientId != null && message.hasOwnProperty("clientId"))
                if (!$util.isString(message.clientId))
                    return "clientId: string expected";
            return null;
        };

        /**
         * Creates a ClientMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof terminal.ClientMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {terminal.ClientMessage} ClientMessage
         */
        ClientMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.terminal.ClientMessage)
                return object;
            let message = new $root.terminal.ClientMessage();
            if (object.authRequest != null) {
                if (typeof object.authRequest !== "object")
                    throw TypeError(".terminal.ClientMessage.authRequest: object expected");
                message.authRequest = $root.terminal.AuthRequest.fromObject(object.authRequest);
            }
            if (object.registerHost != null) {
                if (typeof object.registerHost !== "object")
                    throw TypeError(".terminal.ClientMessage.registerHost: object expected");
                message.registerHost = $root.terminal.RegisterHostRequest.fromObject(object.registerHost);
            }
            if (object.ptyInput != null) {
                if (typeof object.ptyInput !== "object")
                    throw TypeError(".terminal.ClientMessage.ptyInput: object expected");
                message.ptyInput = $root.terminal.PtyInput.fromObject(object.ptyInput);
            }
            if (object.ptyResize != null) {
                if (typeof object.ptyResize !== "object")
                    throw TypeError(".terminal.ClientMessage.ptyResize: object expected");
                message.ptyResize = $root.terminal.PtyResize.fromObject(object.ptyResize);
            }
            if (object.toggleScreen != null) {
                if (typeof object.toggleScreen !== "object")
                    throw TypeError(".terminal.ClientMessage.toggleScreen: object expected");
                message.toggleScreen = $root.terminal.ToggleScreenRequest.fromObject(object.toggleScreen);
            }
            if (object.toggleAdmin != null) {
                if (typeof object.toggleAdmin !== "object")
                    throw TypeError(".terminal.ClientMessage.toggleAdmin: object expected");
                message.toggleAdmin = $root.terminal.ToggleAdminRequest.fromObject(object.toggleAdmin);
            }
            if (object.clientId != null)
                message.clientId = String(object.clientId);
            return message;
        };

        /**
         * Creates a plain object from a ClientMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof terminal.ClientMessage
         * @static
         * @param {terminal.ClientMessage} message ClientMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ClientMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.clientId = "";
            if (message.authRequest != null && message.hasOwnProperty("authRequest")) {
                object.authRequest = $root.terminal.AuthRequest.toObject(message.authRequest, options);
                if (options.oneofs)
                    object.payload = "authRequest";
            }
            if (message.registerHost != null && message.hasOwnProperty("registerHost")) {
                object.registerHost = $root.terminal.RegisterHostRequest.toObject(message.registerHost, options);
                if (options.oneofs)
                    object.payload = "registerHost";
            }
            if (message.ptyInput != null && message.hasOwnProperty("ptyInput")) {
                object.ptyInput = $root.terminal.PtyInput.toObject(message.ptyInput, options);
                if (options.oneofs)
                    object.payload = "ptyInput";
            }
            if (message.ptyResize != null && message.hasOwnProperty("ptyResize")) {
                object.ptyResize = $root.terminal.PtyResize.toObject(message.ptyResize, options);
                if (options.oneofs)
                    object.payload = "ptyResize";
            }
            if (message.toggleScreen != null && message.hasOwnProperty("toggleScreen")) {
                object.toggleScreen = $root.terminal.ToggleScreenRequest.toObject(message.toggleScreen, options);
                if (options.oneofs)
                    object.payload = "toggleScreen";
            }
            if (message.toggleAdmin != null && message.hasOwnProperty("toggleAdmin")) {
                object.toggleAdmin = $root.terminal.ToggleAdminRequest.toObject(message.toggleAdmin, options);
                if (options.oneofs)
                    object.payload = "toggleAdmin";
            }
            if (message.clientId != null && message.hasOwnProperty("clientId"))
                object.clientId = message.clientId;
            return object;
        };

        /**
         * Converts this ClientMessage to JSON.
         * @function toJSON
         * @memberof terminal.ClientMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ClientMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ClientMessage
         * @function getTypeUrl
         * @memberof terminal.ClientMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ClientMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/terminal.ClientMessage";
        };

        return ClientMessage;
    })();

    terminal.ServerMessage = (function() {

        /**
         * Properties of a ServerMessage.
         * @memberof terminal
         * @interface IServerMessage
         * @property {terminal.IAuthResponse|null} [authResponse] ServerMessage authResponse
         * @property {terminal.IRegisterHostResponse|null} [registerHostResponse] ServerMessage registerHostResponse
         * @property {terminal.IPtyOutput|null} [ptyOutput] ServerMessage ptyOutput
         * @property {terminal.IPtyExit|null} [ptyExit] ServerMessage ptyExit
         * @property {terminal.ISystemMessage|null} [systemMessage] ServerMessage systemMessage
         * @property {terminal.IErrorMessage|null} [errorMessage] ServerMessage errorMessage
         * @property {terminal.IScreenFrame|null} [screenFrame] ServerMessage screenFrame
         */

        /**
         * Constructs a new ServerMessage.
         * @memberof terminal
         * @classdesc Represents a ServerMessage.
         * @implements IServerMessage
         * @constructor
         * @param {terminal.IServerMessage=} [properties] Properties to set
         */
        function ServerMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ServerMessage authResponse.
         * @member {terminal.IAuthResponse|null|undefined} authResponse
         * @memberof terminal.ServerMessage
         * @instance
         */
        ServerMessage.prototype.authResponse = null;

        /**
         * ServerMessage registerHostResponse.
         * @member {terminal.IRegisterHostResponse|null|undefined} registerHostResponse
         * @memberof terminal.ServerMessage
         * @instance
         */
        ServerMessage.prototype.registerHostResponse = null;

        /**
         * ServerMessage ptyOutput.
         * @member {terminal.IPtyOutput|null|undefined} ptyOutput
         * @memberof terminal.ServerMessage
         * @instance
         */
        ServerMessage.prototype.ptyOutput = null;

        /**
         * ServerMessage ptyExit.
         * @member {terminal.IPtyExit|null|undefined} ptyExit
         * @memberof terminal.ServerMessage
         * @instance
         */
        ServerMessage.prototype.ptyExit = null;

        /**
         * ServerMessage systemMessage.
         * @member {terminal.ISystemMessage|null|undefined} systemMessage
         * @memberof terminal.ServerMessage
         * @instance
         */
        ServerMessage.prototype.systemMessage = null;

        /**
         * ServerMessage errorMessage.
         * @member {terminal.IErrorMessage|null|undefined} errorMessage
         * @memberof terminal.ServerMessage
         * @instance
         */
        ServerMessage.prototype.errorMessage = null;

        /**
         * ServerMessage screenFrame.
         * @member {terminal.IScreenFrame|null|undefined} screenFrame
         * @memberof terminal.ServerMessage
         * @instance
         */
        ServerMessage.prototype.screenFrame = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * ServerMessage payload.
         * @member {"authResponse"|"registerHostResponse"|"ptyOutput"|"ptyExit"|"systemMessage"|"errorMessage"|"screenFrame"|undefined} payload
         * @memberof terminal.ServerMessage
         * @instance
         */
        Object.defineProperty(ServerMessage.prototype, "payload", {
            get: $util.oneOfGetter($oneOfFields = ["authResponse", "registerHostResponse", "ptyOutput", "ptyExit", "systemMessage", "errorMessage", "screenFrame"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new ServerMessage instance using the specified properties.
         * @function create
         * @memberof terminal.ServerMessage
         * @static
         * @param {terminal.IServerMessage=} [properties] Properties to set
         * @returns {terminal.ServerMessage} ServerMessage instance
         */
        ServerMessage.create = function create(properties) {
            return new ServerMessage(properties);
        };

        /**
         * Encodes the specified ServerMessage message. Does not implicitly {@link terminal.ServerMessage.verify|verify} messages.
         * @function encode
         * @memberof terminal.ServerMessage
         * @static
         * @param {terminal.IServerMessage} message ServerMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ServerMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.authResponse != null && Object.hasOwnProperty.call(message, "authResponse"))
                $root.terminal.AuthResponse.encode(message.authResponse, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.registerHostResponse != null && Object.hasOwnProperty.call(message, "registerHostResponse"))
                $root.terminal.RegisterHostResponse.encode(message.registerHostResponse, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.ptyOutput != null && Object.hasOwnProperty.call(message, "ptyOutput"))
                $root.terminal.PtyOutput.encode(message.ptyOutput, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.ptyExit != null && Object.hasOwnProperty.call(message, "ptyExit"))
                $root.terminal.PtyExit.encode(message.ptyExit, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.systemMessage != null && Object.hasOwnProperty.call(message, "systemMessage"))
                $root.terminal.SystemMessage.encode(message.systemMessage, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.errorMessage != null && Object.hasOwnProperty.call(message, "errorMessage"))
                $root.terminal.ErrorMessage.encode(message.errorMessage, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.screenFrame != null && Object.hasOwnProperty.call(message, "screenFrame"))
                $root.terminal.ScreenFrame.encode(message.screenFrame, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ServerMessage message, length delimited. Does not implicitly {@link terminal.ServerMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof terminal.ServerMessage
         * @static
         * @param {terminal.IServerMessage} message ServerMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ServerMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ServerMessage message from the specified reader or buffer.
         * @function decode
         * @memberof terminal.ServerMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {terminal.ServerMessage} ServerMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ServerMessage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.terminal.ServerMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.authResponse = $root.terminal.AuthResponse.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.registerHostResponse = $root.terminal.RegisterHostResponse.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.ptyOutput = $root.terminal.PtyOutput.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.ptyExit = $root.terminal.PtyExit.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.systemMessage = $root.terminal.SystemMessage.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.errorMessage = $root.terminal.ErrorMessage.decode(reader, reader.uint32());
                        break;
                    }
                case 7: {
                        message.screenFrame = $root.terminal.ScreenFrame.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ServerMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof terminal.ServerMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {terminal.ServerMessage} ServerMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ServerMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ServerMessage message.
         * @function verify
         * @memberof terminal.ServerMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ServerMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.authResponse != null && message.hasOwnProperty("authResponse")) {
                properties.payload = 1;
                {
                    let error = $root.terminal.AuthResponse.verify(message.authResponse);
                    if (error)
                        return "authResponse." + error;
                }
            }
            if (message.registerHostResponse != null && message.hasOwnProperty("registerHostResponse")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    let error = $root.terminal.RegisterHostResponse.verify(message.registerHostResponse);
                    if (error)
                        return "registerHostResponse." + error;
                }
            }
            if (message.ptyOutput != null && message.hasOwnProperty("ptyOutput")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    let error = $root.terminal.PtyOutput.verify(message.ptyOutput);
                    if (error)
                        return "ptyOutput." + error;
                }
            }
            if (message.ptyExit != null && message.hasOwnProperty("ptyExit")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    let error = $root.terminal.PtyExit.verify(message.ptyExit);
                    if (error)
                        return "ptyExit." + error;
                }
            }
            if (message.systemMessage != null && message.hasOwnProperty("systemMessage")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    let error = $root.terminal.SystemMessage.verify(message.systemMessage);
                    if (error)
                        return "systemMessage." + error;
                }
            }
            if (message.errorMessage != null && message.hasOwnProperty("errorMessage")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    let error = $root.terminal.ErrorMessage.verify(message.errorMessage);
                    if (error)
                        return "errorMessage." + error;
                }
            }
            if (message.screenFrame != null && message.hasOwnProperty("screenFrame")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    let error = $root.terminal.ScreenFrame.verify(message.screenFrame);
                    if (error)
                        return "screenFrame." + error;
                }
            }
            return null;
        };

        /**
         * Creates a ServerMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof terminal.ServerMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {terminal.ServerMessage} ServerMessage
         */
        ServerMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.terminal.ServerMessage)
                return object;
            let message = new $root.terminal.ServerMessage();
            if (object.authResponse != null) {
                if (typeof object.authResponse !== "object")
                    throw TypeError(".terminal.ServerMessage.authResponse: object expected");
                message.authResponse = $root.terminal.AuthResponse.fromObject(object.authResponse);
            }
            if (object.registerHostResponse != null) {
                if (typeof object.registerHostResponse !== "object")
                    throw TypeError(".terminal.ServerMessage.registerHostResponse: object expected");
                message.registerHostResponse = $root.terminal.RegisterHostResponse.fromObject(object.registerHostResponse);
            }
            if (object.ptyOutput != null) {
                if (typeof object.ptyOutput !== "object")
                    throw TypeError(".terminal.ServerMessage.ptyOutput: object expected");
                message.ptyOutput = $root.terminal.PtyOutput.fromObject(object.ptyOutput);
            }
            if (object.ptyExit != null) {
                if (typeof object.ptyExit !== "object")
                    throw TypeError(".terminal.ServerMessage.ptyExit: object expected");
                message.ptyExit = $root.terminal.PtyExit.fromObject(object.ptyExit);
            }
            if (object.systemMessage != null) {
                if (typeof object.systemMessage !== "object")
                    throw TypeError(".terminal.ServerMessage.systemMessage: object expected");
                message.systemMessage = $root.terminal.SystemMessage.fromObject(object.systemMessage);
            }
            if (object.errorMessage != null) {
                if (typeof object.errorMessage !== "object")
                    throw TypeError(".terminal.ServerMessage.errorMessage: object expected");
                message.errorMessage = $root.terminal.ErrorMessage.fromObject(object.errorMessage);
            }
            if (object.screenFrame != null) {
                if (typeof object.screenFrame !== "object")
                    throw TypeError(".terminal.ServerMessage.screenFrame: object expected");
                message.screenFrame = $root.terminal.ScreenFrame.fromObject(object.screenFrame);
            }
            return message;
        };

        /**
         * Creates a plain object from a ServerMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof terminal.ServerMessage
         * @static
         * @param {terminal.ServerMessage} message ServerMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ServerMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (message.authResponse != null && message.hasOwnProperty("authResponse")) {
                object.authResponse = $root.terminal.AuthResponse.toObject(message.authResponse, options);
                if (options.oneofs)
                    object.payload = "authResponse";
            }
            if (message.registerHostResponse != null && message.hasOwnProperty("registerHostResponse")) {
                object.registerHostResponse = $root.terminal.RegisterHostResponse.toObject(message.registerHostResponse, options);
                if (options.oneofs)
                    object.payload = "registerHostResponse";
            }
            if (message.ptyOutput != null && message.hasOwnProperty("ptyOutput")) {
                object.ptyOutput = $root.terminal.PtyOutput.toObject(message.ptyOutput, options);
                if (options.oneofs)
                    object.payload = "ptyOutput";
            }
            if (message.ptyExit != null && message.hasOwnProperty("ptyExit")) {
                object.ptyExit = $root.terminal.PtyExit.toObject(message.ptyExit, options);
                if (options.oneofs)
                    object.payload = "ptyExit";
            }
            if (message.systemMessage != null && message.hasOwnProperty("systemMessage")) {
                object.systemMessage = $root.terminal.SystemMessage.toObject(message.systemMessage, options);
                if (options.oneofs)
                    object.payload = "systemMessage";
            }
            if (message.errorMessage != null && message.hasOwnProperty("errorMessage")) {
                object.errorMessage = $root.terminal.ErrorMessage.toObject(message.errorMessage, options);
                if (options.oneofs)
                    object.payload = "errorMessage";
            }
            if (message.screenFrame != null && message.hasOwnProperty("screenFrame")) {
                object.screenFrame = $root.terminal.ScreenFrame.toObject(message.screenFrame, options);
                if (options.oneofs)
                    object.payload = "screenFrame";
            }
            return object;
        };

        /**
         * Converts this ServerMessage to JSON.
         * @function toJSON
         * @memberof terminal.ServerMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ServerMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ServerMessage
         * @function getTypeUrl
         * @memberof terminal.ServerMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ServerMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/terminal.ServerMessage";
        };

        return ServerMessage;
    })();

    terminal.HostMessage = (function() {

        /**
         * Properties of a HostMessage.
         * @memberof terminal
         * @interface IHostMessage
         * @property {terminal.IAuthRequest|null} [authRequest] HostMessage authRequest
         * @property {terminal.IRegisterHostRequest|null} [registerHost] HostMessage registerHost
         * @property {terminal.IPtyOutput|null} [ptyOutput] HostMessage ptyOutput
         * @property {terminal.IPtyExit|null} [ptyExit] HostMessage ptyExit
         * @property {terminal.IScreenFrame|null} [screenFrame] HostMessage screenFrame
         * @property {terminal.IHostCapabilities|null} [capabilities] HostMessage capabilities
         */

        /**
         * Constructs a new HostMessage.
         * @memberof terminal
         * @classdesc Represents a HostMessage.
         * @implements IHostMessage
         * @constructor
         * @param {terminal.IHostMessage=} [properties] Properties to set
         */
        function HostMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HostMessage authRequest.
         * @member {terminal.IAuthRequest|null|undefined} authRequest
         * @memberof terminal.HostMessage
         * @instance
         */
        HostMessage.prototype.authRequest = null;

        /**
         * HostMessage registerHost.
         * @member {terminal.IRegisterHostRequest|null|undefined} registerHost
         * @memberof terminal.HostMessage
         * @instance
         */
        HostMessage.prototype.registerHost = null;

        /**
         * HostMessage ptyOutput.
         * @member {terminal.IPtyOutput|null|undefined} ptyOutput
         * @memberof terminal.HostMessage
         * @instance
         */
        HostMessage.prototype.ptyOutput = null;

        /**
         * HostMessage ptyExit.
         * @member {terminal.IPtyExit|null|undefined} ptyExit
         * @memberof terminal.HostMessage
         * @instance
         */
        HostMessage.prototype.ptyExit = null;

        /**
         * HostMessage screenFrame.
         * @member {terminal.IScreenFrame|null|undefined} screenFrame
         * @memberof terminal.HostMessage
         * @instance
         */
        HostMessage.prototype.screenFrame = null;

        /**
         * HostMessage capabilities.
         * @member {terminal.IHostCapabilities|null|undefined} capabilities
         * @memberof terminal.HostMessage
         * @instance
         */
        HostMessage.prototype.capabilities = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * HostMessage payload.
         * @member {"authRequest"|"registerHost"|"ptyOutput"|"ptyExit"|"screenFrame"|"capabilities"|undefined} payload
         * @memberof terminal.HostMessage
         * @instance
         */
        Object.defineProperty(HostMessage.prototype, "payload", {
            get: $util.oneOfGetter($oneOfFields = ["authRequest", "registerHost", "ptyOutput", "ptyExit", "screenFrame", "capabilities"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new HostMessage instance using the specified properties.
         * @function create
         * @memberof terminal.HostMessage
         * @static
         * @param {terminal.IHostMessage=} [properties] Properties to set
         * @returns {terminal.HostMessage} HostMessage instance
         */
        HostMessage.create = function create(properties) {
            return new HostMessage(properties);
        };

        /**
         * Encodes the specified HostMessage message. Does not implicitly {@link terminal.HostMessage.verify|verify} messages.
         * @function encode
         * @memberof terminal.HostMessage
         * @static
         * @param {terminal.IHostMessage} message HostMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HostMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.authRequest != null && Object.hasOwnProperty.call(message, "authRequest"))
                $root.terminal.AuthRequest.encode(message.authRequest, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.registerHost != null && Object.hasOwnProperty.call(message, "registerHost"))
                $root.terminal.RegisterHostRequest.encode(message.registerHost, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.ptyOutput != null && Object.hasOwnProperty.call(message, "ptyOutput"))
                $root.terminal.PtyOutput.encode(message.ptyOutput, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.ptyExit != null && Object.hasOwnProperty.call(message, "ptyExit"))
                $root.terminal.PtyExit.encode(message.ptyExit, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.screenFrame != null && Object.hasOwnProperty.call(message, "screenFrame"))
                $root.terminal.ScreenFrame.encode(message.screenFrame, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.capabilities != null && Object.hasOwnProperty.call(message, "capabilities"))
                $root.terminal.HostCapabilities.encode(message.capabilities, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified HostMessage message, length delimited. Does not implicitly {@link terminal.HostMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof terminal.HostMessage
         * @static
         * @param {terminal.IHostMessage} message HostMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HostMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HostMessage message from the specified reader or buffer.
         * @function decode
         * @memberof terminal.HostMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {terminal.HostMessage} HostMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HostMessage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.terminal.HostMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.authRequest = $root.terminal.AuthRequest.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.registerHost = $root.terminal.RegisterHostRequest.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.ptyOutput = $root.terminal.PtyOutput.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.ptyExit = $root.terminal.PtyExit.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.screenFrame = $root.terminal.ScreenFrame.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.capabilities = $root.terminal.HostCapabilities.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HostMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof terminal.HostMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {terminal.HostMessage} HostMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HostMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HostMessage message.
         * @function verify
         * @memberof terminal.HostMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HostMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.authRequest != null && message.hasOwnProperty("authRequest")) {
                properties.payload = 1;
                {
                    let error = $root.terminal.AuthRequest.verify(message.authRequest);
                    if (error)
                        return "authRequest." + error;
                }
            }
            if (message.registerHost != null && message.hasOwnProperty("registerHost")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    let error = $root.terminal.RegisterHostRequest.verify(message.registerHost);
                    if (error)
                        return "registerHost." + error;
                }
            }
            if (message.ptyOutput != null && message.hasOwnProperty("ptyOutput")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    let error = $root.terminal.PtyOutput.verify(message.ptyOutput);
                    if (error)
                        return "ptyOutput." + error;
                }
            }
            if (message.ptyExit != null && message.hasOwnProperty("ptyExit")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    let error = $root.terminal.PtyExit.verify(message.ptyExit);
                    if (error)
                        return "ptyExit." + error;
                }
            }
            if (message.screenFrame != null && message.hasOwnProperty("screenFrame")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    let error = $root.terminal.ScreenFrame.verify(message.screenFrame);
                    if (error)
                        return "screenFrame." + error;
                }
            }
            if (message.capabilities != null && message.hasOwnProperty("capabilities")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    let error = $root.terminal.HostCapabilities.verify(message.capabilities);
                    if (error)
                        return "capabilities." + error;
                }
            }
            return null;
        };

        /**
         * Creates a HostMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof terminal.HostMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {terminal.HostMessage} HostMessage
         */
        HostMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.terminal.HostMessage)
                return object;
            let message = new $root.terminal.HostMessage();
            if (object.authRequest != null) {
                if (typeof object.authRequest !== "object")
                    throw TypeError(".terminal.HostMessage.authRequest: object expected");
                message.authRequest = $root.terminal.AuthRequest.fromObject(object.authRequest);
            }
            if (object.registerHost != null) {
                if (typeof object.registerHost !== "object")
                    throw TypeError(".terminal.HostMessage.registerHost: object expected");
                message.registerHost = $root.terminal.RegisterHostRequest.fromObject(object.registerHost);
            }
            if (object.ptyOutput != null) {
                if (typeof object.ptyOutput !== "object")
                    throw TypeError(".terminal.HostMessage.ptyOutput: object expected");
                message.ptyOutput = $root.terminal.PtyOutput.fromObject(object.ptyOutput);
            }
            if (object.ptyExit != null) {
                if (typeof object.ptyExit !== "object")
                    throw TypeError(".terminal.HostMessage.ptyExit: object expected");
                message.ptyExit = $root.terminal.PtyExit.fromObject(object.ptyExit);
            }
            if (object.screenFrame != null) {
                if (typeof object.screenFrame !== "object")
                    throw TypeError(".terminal.HostMessage.screenFrame: object expected");
                message.screenFrame = $root.terminal.ScreenFrame.fromObject(object.screenFrame);
            }
            if (object.capabilities != null) {
                if (typeof object.capabilities !== "object")
                    throw TypeError(".terminal.HostMessage.capabilities: object expected");
                message.capabilities = $root.terminal.HostCapabilities.fromObject(object.capabilities);
            }
            return message;
        };

        /**
         * Creates a plain object from a HostMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof terminal.HostMessage
         * @static
         * @param {terminal.HostMessage} message HostMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HostMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (message.authRequest != null && message.hasOwnProperty("authRequest")) {
                object.authRequest = $root.terminal.AuthRequest.toObject(message.authRequest, options);
                if (options.oneofs)
                    object.payload = "authRequest";
            }
            if (message.registerHost != null && message.hasOwnProperty("registerHost")) {
                object.registerHost = $root.terminal.RegisterHostRequest.toObject(message.registerHost, options);
                if (options.oneofs)
                    object.payload = "registerHost";
            }
            if (message.ptyOutput != null && message.hasOwnProperty("ptyOutput")) {
                object.ptyOutput = $root.terminal.PtyOutput.toObject(message.ptyOutput, options);
                if (options.oneofs)
                    object.payload = "ptyOutput";
            }
            if (message.ptyExit != null && message.hasOwnProperty("ptyExit")) {
                object.ptyExit = $root.terminal.PtyExit.toObject(message.ptyExit, options);
                if (options.oneofs)
                    object.payload = "ptyExit";
            }
            if (message.screenFrame != null && message.hasOwnProperty("screenFrame")) {
                object.screenFrame = $root.terminal.ScreenFrame.toObject(message.screenFrame, options);
                if (options.oneofs)
                    object.payload = "screenFrame";
            }
            if (message.capabilities != null && message.hasOwnProperty("capabilities")) {
                object.capabilities = $root.terminal.HostCapabilities.toObject(message.capabilities, options);
                if (options.oneofs)
                    object.payload = "capabilities";
            }
            return object;
        };

        /**
         * Converts this HostMessage to JSON.
         * @function toJSON
         * @memberof terminal.HostMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HostMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for HostMessage
         * @function getTypeUrl
         * @memberof terminal.HostMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        HostMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/terminal.HostMessage";
        };

        return HostMessage;
    })();

    terminal.AuthRequest = (function() {

        /**
         * Properties of an AuthRequest.
         * @memberof terminal
         * @interface IAuthRequest
         * @property {string|null} [hostId] AuthRequest hostId
         * @property {string|null} [token] AuthRequest token
         */

        /**
         * Constructs a new AuthRequest.
         * @memberof terminal
         * @classdesc Represents an AuthRequest.
         * @implements IAuthRequest
         * @constructor
         * @param {terminal.IAuthRequest=} [properties] Properties to set
         */
        function AuthRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AuthRequest hostId.
         * @member {string} hostId
         * @memberof terminal.AuthRequest
         * @instance
         */
        AuthRequest.prototype.hostId = "";

        /**
         * AuthRequest token.
         * @member {string} token
         * @memberof terminal.AuthRequest
         * @instance
         */
        AuthRequest.prototype.token = "";

        /**
         * Creates a new AuthRequest instance using the specified properties.
         * @function create
         * @memberof terminal.AuthRequest
         * @static
         * @param {terminal.IAuthRequest=} [properties] Properties to set
         * @returns {terminal.AuthRequest} AuthRequest instance
         */
        AuthRequest.create = function create(properties) {
            return new AuthRequest(properties);
        };

        /**
         * Encodes the specified AuthRequest message. Does not implicitly {@link terminal.AuthRequest.verify|verify} messages.
         * @function encode
         * @memberof terminal.AuthRequest
         * @static
         * @param {terminal.IAuthRequest} message AuthRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AuthRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.hostId != null && Object.hasOwnProperty.call(message, "hostId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.hostId);
            if (message.token != null && Object.hasOwnProperty.call(message, "token"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.token);
            return writer;
        };

        /**
         * Encodes the specified AuthRequest message, length delimited. Does not implicitly {@link terminal.AuthRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof terminal.AuthRequest
         * @static
         * @param {terminal.IAuthRequest} message AuthRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AuthRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AuthRequest message from the specified reader or buffer.
         * @function decode
         * @memberof terminal.AuthRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {terminal.AuthRequest} AuthRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AuthRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.terminal.AuthRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.hostId = reader.string();
                        break;
                    }
                case 2: {
                        message.token = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AuthRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof terminal.AuthRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {terminal.AuthRequest} AuthRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AuthRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AuthRequest message.
         * @function verify
         * @memberof terminal.AuthRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AuthRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.hostId != null && message.hasOwnProperty("hostId"))
                if (!$util.isString(message.hostId))
                    return "hostId: string expected";
            if (message.token != null && message.hasOwnProperty("token"))
                if (!$util.isString(message.token))
                    return "token: string expected";
            return null;
        };

        /**
         * Creates an AuthRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof terminal.AuthRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {terminal.AuthRequest} AuthRequest
         */
        AuthRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.terminal.AuthRequest)
                return object;
            let message = new $root.terminal.AuthRequest();
            if (object.hostId != null)
                message.hostId = String(object.hostId);
            if (object.token != null)
                message.token = String(object.token);
            return message;
        };

        /**
         * Creates a plain object from an AuthRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof terminal.AuthRequest
         * @static
         * @param {terminal.AuthRequest} message AuthRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AuthRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.hostId = "";
                object.token = "";
            }
            if (message.hostId != null && message.hasOwnProperty("hostId"))
                object.hostId = message.hostId;
            if (message.token != null && message.hasOwnProperty("token"))
                object.token = message.token;
            return object;
        };

        /**
         * Converts this AuthRequest to JSON.
         * @function toJSON
         * @memberof terminal.AuthRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AuthRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for AuthRequest
         * @function getTypeUrl
         * @memberof terminal.AuthRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        AuthRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/terminal.AuthRequest";
        };

        return AuthRequest;
    })();

    terminal.AuthResponse = (function() {

        /**
         * Properties of an AuthResponse.
         * @memberof terminal
         * @interface IAuthResponse
         * @property {boolean|null} [ok] AuthResponse ok
         * @property {string|null} [error] AuthResponse error
         */

        /**
         * Constructs a new AuthResponse.
         * @memberof terminal
         * @classdesc Represents an AuthResponse.
         * @implements IAuthResponse
         * @constructor
         * @param {terminal.IAuthResponse=} [properties] Properties to set
         */
        function AuthResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AuthResponse ok.
         * @member {boolean} ok
         * @memberof terminal.AuthResponse
         * @instance
         */
        AuthResponse.prototype.ok = false;

        /**
         * AuthResponse error.
         * @member {string} error
         * @memberof terminal.AuthResponse
         * @instance
         */
        AuthResponse.prototype.error = "";

        /**
         * Creates a new AuthResponse instance using the specified properties.
         * @function create
         * @memberof terminal.AuthResponse
         * @static
         * @param {terminal.IAuthResponse=} [properties] Properties to set
         * @returns {terminal.AuthResponse} AuthResponse instance
         */
        AuthResponse.create = function create(properties) {
            return new AuthResponse(properties);
        };

        /**
         * Encodes the specified AuthResponse message. Does not implicitly {@link terminal.AuthResponse.verify|verify} messages.
         * @function encode
         * @memberof terminal.AuthResponse
         * @static
         * @param {terminal.IAuthResponse} message AuthResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AuthResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ok != null && Object.hasOwnProperty.call(message, "ok"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.ok);
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.error);
            return writer;
        };

        /**
         * Encodes the specified AuthResponse message, length delimited. Does not implicitly {@link terminal.AuthResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof terminal.AuthResponse
         * @static
         * @param {terminal.IAuthResponse} message AuthResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AuthResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AuthResponse message from the specified reader or buffer.
         * @function decode
         * @memberof terminal.AuthResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {terminal.AuthResponse} AuthResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AuthResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.terminal.AuthResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.ok = reader.bool();
                        break;
                    }
                case 2: {
                        message.error = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AuthResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof terminal.AuthResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {terminal.AuthResponse} AuthResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AuthResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AuthResponse message.
         * @function verify
         * @memberof terminal.AuthResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AuthResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ok != null && message.hasOwnProperty("ok"))
                if (typeof message.ok !== "boolean")
                    return "ok: boolean expected";
            if (message.error != null && message.hasOwnProperty("error"))
                if (!$util.isString(message.error))
                    return "error: string expected";
            return null;
        };

        /**
         * Creates an AuthResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof terminal.AuthResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {terminal.AuthResponse} AuthResponse
         */
        AuthResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.terminal.AuthResponse)
                return object;
            let message = new $root.terminal.AuthResponse();
            if (object.ok != null)
                message.ok = Boolean(object.ok);
            if (object.error != null)
                message.error = String(object.error);
            return message;
        };

        /**
         * Creates a plain object from an AuthResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof terminal.AuthResponse
         * @static
         * @param {terminal.AuthResponse} message AuthResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AuthResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.ok = false;
                object.error = "";
            }
            if (message.ok != null && message.hasOwnProperty("ok"))
                object.ok = message.ok;
            if (message.error != null && message.hasOwnProperty("error"))
                object.error = message.error;
            return object;
        };

        /**
         * Converts this AuthResponse to JSON.
         * @function toJSON
         * @memberof terminal.AuthResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AuthResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for AuthResponse
         * @function getTypeUrl
         * @memberof terminal.AuthResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        AuthResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/terminal.AuthResponse";
        };

        return AuthResponse;
    })();

    terminal.RegisterHostRequest = (function() {

        /**
         * Properties of a RegisterHostRequest.
         * @memberof terminal
         * @interface IRegisterHostRequest
         * @property {string|null} [hostId] RegisterHostRequest hostId
         * @property {string|null} [password] RegisterHostRequest password
         * @property {boolean|null} [runAsAdmin] RegisterHostRequest runAsAdmin
         */

        /**
         * Constructs a new RegisterHostRequest.
         * @memberof terminal
         * @classdesc Represents a RegisterHostRequest.
         * @implements IRegisterHostRequest
         * @constructor
         * @param {terminal.IRegisterHostRequest=} [properties] Properties to set
         */
        function RegisterHostRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RegisterHostRequest hostId.
         * @member {string} hostId
         * @memberof terminal.RegisterHostRequest
         * @instance
         */
        RegisterHostRequest.prototype.hostId = "";

        /**
         * RegisterHostRequest password.
         * @member {string} password
         * @memberof terminal.RegisterHostRequest
         * @instance
         */
        RegisterHostRequest.prototype.password = "";

        /**
         * RegisterHostRequest runAsAdmin.
         * @member {boolean} runAsAdmin
         * @memberof terminal.RegisterHostRequest
         * @instance
         */
        RegisterHostRequest.prototype.runAsAdmin = false;

        /**
         * Creates a new RegisterHostRequest instance using the specified properties.
         * @function create
         * @memberof terminal.RegisterHostRequest
         * @static
         * @param {terminal.IRegisterHostRequest=} [properties] Properties to set
         * @returns {terminal.RegisterHostRequest} RegisterHostRequest instance
         */
        RegisterHostRequest.create = function create(properties) {
            return new RegisterHostRequest(properties);
        };

        /**
         * Encodes the specified RegisterHostRequest message. Does not implicitly {@link terminal.RegisterHostRequest.verify|verify} messages.
         * @function encode
         * @memberof terminal.RegisterHostRequest
         * @static
         * @param {terminal.IRegisterHostRequest} message RegisterHostRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RegisterHostRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.hostId != null && Object.hasOwnProperty.call(message, "hostId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.hostId);
            if (message.password != null && Object.hasOwnProperty.call(message, "password"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.password);
            if (message.runAsAdmin != null && Object.hasOwnProperty.call(message, "runAsAdmin"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.runAsAdmin);
            return writer;
        };

        /**
         * Encodes the specified RegisterHostRequest message, length delimited. Does not implicitly {@link terminal.RegisterHostRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof terminal.RegisterHostRequest
         * @static
         * @param {terminal.IRegisterHostRequest} message RegisterHostRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RegisterHostRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RegisterHostRequest message from the specified reader or buffer.
         * @function decode
         * @memberof terminal.RegisterHostRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {terminal.RegisterHostRequest} RegisterHostRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RegisterHostRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.terminal.RegisterHostRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.hostId = reader.string();
                        break;
                    }
                case 2: {
                        message.password = reader.string();
                        break;
                    }
                case 3: {
                        message.runAsAdmin = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RegisterHostRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof terminal.RegisterHostRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {terminal.RegisterHostRequest} RegisterHostRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RegisterHostRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RegisterHostRequest message.
         * @function verify
         * @memberof terminal.RegisterHostRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RegisterHostRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.hostId != null && message.hasOwnProperty("hostId"))
                if (!$util.isString(message.hostId))
                    return "hostId: string expected";
            if (message.password != null && message.hasOwnProperty("password"))
                if (!$util.isString(message.password))
                    return "password: string expected";
            if (message.runAsAdmin != null && message.hasOwnProperty("runAsAdmin"))
                if (typeof message.runAsAdmin !== "boolean")
                    return "runAsAdmin: boolean expected";
            return null;
        };

        /**
         * Creates a RegisterHostRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof terminal.RegisterHostRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {terminal.RegisterHostRequest} RegisterHostRequest
         */
        RegisterHostRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.terminal.RegisterHostRequest)
                return object;
            let message = new $root.terminal.RegisterHostRequest();
            if (object.hostId != null)
                message.hostId = String(object.hostId);
            if (object.password != null)
                message.password = String(object.password);
            if (object.runAsAdmin != null)
                message.runAsAdmin = Boolean(object.runAsAdmin);
            return message;
        };

        /**
         * Creates a plain object from a RegisterHostRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof terminal.RegisterHostRequest
         * @static
         * @param {terminal.RegisterHostRequest} message RegisterHostRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RegisterHostRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.hostId = "";
                object.password = "";
                object.runAsAdmin = false;
            }
            if (message.hostId != null && message.hasOwnProperty("hostId"))
                object.hostId = message.hostId;
            if (message.password != null && message.hasOwnProperty("password"))
                object.password = message.password;
            if (message.runAsAdmin != null && message.hasOwnProperty("runAsAdmin"))
                object.runAsAdmin = message.runAsAdmin;
            return object;
        };

        /**
         * Converts this RegisterHostRequest to JSON.
         * @function toJSON
         * @memberof terminal.RegisterHostRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RegisterHostRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for RegisterHostRequest
         * @function getTypeUrl
         * @memberof terminal.RegisterHostRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        RegisterHostRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/terminal.RegisterHostRequest";
        };

        return RegisterHostRequest;
    })();

    terminal.RegisterHostResponse = (function() {

        /**
         * Properties of a RegisterHostResponse.
         * @memberof terminal
         * @interface IRegisterHostResponse
         * @property {boolean|null} [ok] RegisterHostResponse ok
         * @property {string|null} [token] RegisterHostResponse token
         * @property {string|null} [error] RegisterHostResponse error
         * @property {boolean|null} [isAdmin] RegisterHostResponse isAdmin
         */

        /**
         * Constructs a new RegisterHostResponse.
         * @memberof terminal
         * @classdesc Represents a RegisterHostResponse.
         * @implements IRegisterHostResponse
         * @constructor
         * @param {terminal.IRegisterHostResponse=} [properties] Properties to set
         */
        function RegisterHostResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RegisterHostResponse ok.
         * @member {boolean} ok
         * @memberof terminal.RegisterHostResponse
         * @instance
         */
        RegisterHostResponse.prototype.ok = false;

        /**
         * RegisterHostResponse token.
         * @member {string} token
         * @memberof terminal.RegisterHostResponse
         * @instance
         */
        RegisterHostResponse.prototype.token = "";

        /**
         * RegisterHostResponse error.
         * @member {string} error
         * @memberof terminal.RegisterHostResponse
         * @instance
         */
        RegisterHostResponse.prototype.error = "";

        /**
         * RegisterHostResponse isAdmin.
         * @member {boolean} isAdmin
         * @memberof terminal.RegisterHostResponse
         * @instance
         */
        RegisterHostResponse.prototype.isAdmin = false;

        /**
         * Creates a new RegisterHostResponse instance using the specified properties.
         * @function create
         * @memberof terminal.RegisterHostResponse
         * @static
         * @param {terminal.IRegisterHostResponse=} [properties] Properties to set
         * @returns {terminal.RegisterHostResponse} RegisterHostResponse instance
         */
        RegisterHostResponse.create = function create(properties) {
            return new RegisterHostResponse(properties);
        };

        /**
         * Encodes the specified RegisterHostResponse message. Does not implicitly {@link terminal.RegisterHostResponse.verify|verify} messages.
         * @function encode
         * @memberof terminal.RegisterHostResponse
         * @static
         * @param {terminal.IRegisterHostResponse} message RegisterHostResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RegisterHostResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ok != null && Object.hasOwnProperty.call(message, "ok"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.ok);
            if (message.token != null && Object.hasOwnProperty.call(message, "token"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.token);
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.error);
            if (message.isAdmin != null && Object.hasOwnProperty.call(message, "isAdmin"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.isAdmin);
            return writer;
        };

        /**
         * Encodes the specified RegisterHostResponse message, length delimited. Does not implicitly {@link terminal.RegisterHostResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof terminal.RegisterHostResponse
         * @static
         * @param {terminal.IRegisterHostResponse} message RegisterHostResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RegisterHostResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RegisterHostResponse message from the specified reader or buffer.
         * @function decode
         * @memberof terminal.RegisterHostResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {terminal.RegisterHostResponse} RegisterHostResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RegisterHostResponse.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.terminal.RegisterHostResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.ok = reader.bool();
                        break;
                    }
                case 2: {
                        message.token = reader.string();
                        break;
                    }
                case 3: {
                        message.error = reader.string();
                        break;
                    }
                case 4: {
                        message.isAdmin = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RegisterHostResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof terminal.RegisterHostResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {terminal.RegisterHostResponse} RegisterHostResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RegisterHostResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RegisterHostResponse message.
         * @function verify
         * @memberof terminal.RegisterHostResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RegisterHostResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ok != null && message.hasOwnProperty("ok"))
                if (typeof message.ok !== "boolean")
                    return "ok: boolean expected";
            if (message.token != null && message.hasOwnProperty("token"))
                if (!$util.isString(message.token))
                    return "token: string expected";
            if (message.error != null && message.hasOwnProperty("error"))
                if (!$util.isString(message.error))
                    return "error: string expected";
            if (message.isAdmin != null && message.hasOwnProperty("isAdmin"))
                if (typeof message.isAdmin !== "boolean")
                    return "isAdmin: boolean expected";
            return null;
        };

        /**
         * Creates a RegisterHostResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof terminal.RegisterHostResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {terminal.RegisterHostResponse} RegisterHostResponse
         */
        RegisterHostResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.terminal.RegisterHostResponse)
                return object;
            let message = new $root.terminal.RegisterHostResponse();
            if (object.ok != null)
                message.ok = Boolean(object.ok);
            if (object.token != null)
                message.token = String(object.token);
            if (object.error != null)
                message.error = String(object.error);
            if (object.isAdmin != null)
                message.isAdmin = Boolean(object.isAdmin);
            return message;
        };

        /**
         * Creates a plain object from a RegisterHostResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof terminal.RegisterHostResponse
         * @static
         * @param {terminal.RegisterHostResponse} message RegisterHostResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RegisterHostResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.ok = false;
                object.token = "";
                object.error = "";
                object.isAdmin = false;
            }
            if (message.ok != null && message.hasOwnProperty("ok"))
                object.ok = message.ok;
            if (message.token != null && message.hasOwnProperty("token"))
                object.token = message.token;
            if (message.error != null && message.hasOwnProperty("error"))
                object.error = message.error;
            if (message.isAdmin != null && message.hasOwnProperty("isAdmin"))
                object.isAdmin = message.isAdmin;
            return object;
        };

        /**
         * Converts this RegisterHostResponse to JSON.
         * @function toJSON
         * @memberof terminal.RegisterHostResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RegisterHostResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for RegisterHostResponse
         * @function getTypeUrl
         * @memberof terminal.RegisterHostResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        RegisterHostResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/terminal.RegisterHostResponse";
        };

        return RegisterHostResponse;
    })();

    terminal.PtyInput = (function() {

        /**
         * Properties of a PtyInput.
         * @memberof terminal
         * @interface IPtyInput
         * @property {string|null} [data] PtyInput data
         */

        /**
         * Constructs a new PtyInput.
         * @memberof terminal
         * @classdesc Represents a PtyInput.
         * @implements IPtyInput
         * @constructor
         * @param {terminal.IPtyInput=} [properties] Properties to set
         */
        function PtyInput(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PtyInput data.
         * @member {string} data
         * @memberof terminal.PtyInput
         * @instance
         */
        PtyInput.prototype.data = "";

        /**
         * Creates a new PtyInput instance using the specified properties.
         * @function create
         * @memberof terminal.PtyInput
         * @static
         * @param {terminal.IPtyInput=} [properties] Properties to set
         * @returns {terminal.PtyInput} PtyInput instance
         */
        PtyInput.create = function create(properties) {
            return new PtyInput(properties);
        };

        /**
         * Encodes the specified PtyInput message. Does not implicitly {@link terminal.PtyInput.verify|verify} messages.
         * @function encode
         * @memberof terminal.PtyInput
         * @static
         * @param {terminal.IPtyInput} message PtyInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PtyInput.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.data);
            return writer;
        };

        /**
         * Encodes the specified PtyInput message, length delimited. Does not implicitly {@link terminal.PtyInput.verify|verify} messages.
         * @function encodeDelimited
         * @memberof terminal.PtyInput
         * @static
         * @param {terminal.IPtyInput} message PtyInput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PtyInput.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PtyInput message from the specified reader or buffer.
         * @function decode
         * @memberof terminal.PtyInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {terminal.PtyInput} PtyInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PtyInput.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.terminal.PtyInput();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.data = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PtyInput message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof terminal.PtyInput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {terminal.PtyInput} PtyInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PtyInput.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PtyInput message.
         * @function verify
         * @memberof terminal.PtyInput
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PtyInput.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.data != null && message.hasOwnProperty("data"))
                if (!$util.isString(message.data))
                    return "data: string expected";
            return null;
        };

        /**
         * Creates a PtyInput message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof terminal.PtyInput
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {terminal.PtyInput} PtyInput
         */
        PtyInput.fromObject = function fromObject(object) {
            if (object instanceof $root.terminal.PtyInput)
                return object;
            let message = new $root.terminal.PtyInput();
            if (object.data != null)
                message.data = String(object.data);
            return message;
        };

        /**
         * Creates a plain object from a PtyInput message. Also converts values to other types if specified.
         * @function toObject
         * @memberof terminal.PtyInput
         * @static
         * @param {terminal.PtyInput} message PtyInput
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PtyInput.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.data = "";
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = message.data;
            return object;
        };

        /**
         * Converts this PtyInput to JSON.
         * @function toJSON
         * @memberof terminal.PtyInput
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PtyInput.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for PtyInput
         * @function getTypeUrl
         * @memberof terminal.PtyInput
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PtyInput.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/terminal.PtyInput";
        };

        return PtyInput;
    })();

    terminal.PtyResize = (function() {

        /**
         * Properties of a PtyResize.
         * @memberof terminal
         * @interface IPtyResize
         * @property {number|null} [cols] PtyResize cols
         * @property {number|null} [rows] PtyResize rows
         */

        /**
         * Constructs a new PtyResize.
         * @memberof terminal
         * @classdesc Represents a PtyResize.
         * @implements IPtyResize
         * @constructor
         * @param {terminal.IPtyResize=} [properties] Properties to set
         */
        function PtyResize(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PtyResize cols.
         * @member {number} cols
         * @memberof terminal.PtyResize
         * @instance
         */
        PtyResize.prototype.cols = 0;

        /**
         * PtyResize rows.
         * @member {number} rows
         * @memberof terminal.PtyResize
         * @instance
         */
        PtyResize.prototype.rows = 0;

        /**
         * Creates a new PtyResize instance using the specified properties.
         * @function create
         * @memberof terminal.PtyResize
         * @static
         * @param {terminal.IPtyResize=} [properties] Properties to set
         * @returns {terminal.PtyResize} PtyResize instance
         */
        PtyResize.create = function create(properties) {
            return new PtyResize(properties);
        };

        /**
         * Encodes the specified PtyResize message. Does not implicitly {@link terminal.PtyResize.verify|verify} messages.
         * @function encode
         * @memberof terminal.PtyResize
         * @static
         * @param {terminal.IPtyResize} message PtyResize message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PtyResize.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cols != null && Object.hasOwnProperty.call(message, "cols"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.cols);
            if (message.rows != null && Object.hasOwnProperty.call(message, "rows"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.rows);
            return writer;
        };

        /**
         * Encodes the specified PtyResize message, length delimited. Does not implicitly {@link terminal.PtyResize.verify|verify} messages.
         * @function encodeDelimited
         * @memberof terminal.PtyResize
         * @static
         * @param {terminal.IPtyResize} message PtyResize message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PtyResize.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PtyResize message from the specified reader or buffer.
         * @function decode
         * @memberof terminal.PtyResize
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {terminal.PtyResize} PtyResize
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PtyResize.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.terminal.PtyResize();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.cols = reader.uint32();
                        break;
                    }
                case 2: {
                        message.rows = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PtyResize message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof terminal.PtyResize
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {terminal.PtyResize} PtyResize
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PtyResize.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PtyResize message.
         * @function verify
         * @memberof terminal.PtyResize
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PtyResize.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cols != null && message.hasOwnProperty("cols"))
                if (!$util.isInteger(message.cols))
                    return "cols: integer expected";
            if (message.rows != null && message.hasOwnProperty("rows"))
                if (!$util.isInteger(message.rows))
                    return "rows: integer expected";
            return null;
        };

        /**
         * Creates a PtyResize message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof terminal.PtyResize
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {terminal.PtyResize} PtyResize
         */
        PtyResize.fromObject = function fromObject(object) {
            if (object instanceof $root.terminal.PtyResize)
                return object;
            let message = new $root.terminal.PtyResize();
            if (object.cols != null)
                message.cols = object.cols >>> 0;
            if (object.rows != null)
                message.rows = object.rows >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a PtyResize message. Also converts values to other types if specified.
         * @function toObject
         * @memberof terminal.PtyResize
         * @static
         * @param {terminal.PtyResize} message PtyResize
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PtyResize.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.cols = 0;
                object.rows = 0;
            }
            if (message.cols != null && message.hasOwnProperty("cols"))
                object.cols = message.cols;
            if (message.rows != null && message.hasOwnProperty("rows"))
                object.rows = message.rows;
            return object;
        };

        /**
         * Converts this PtyResize to JSON.
         * @function toJSON
         * @memberof terminal.PtyResize
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PtyResize.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for PtyResize
         * @function getTypeUrl
         * @memberof terminal.PtyResize
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PtyResize.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/terminal.PtyResize";
        };

        return PtyResize;
    })();

    terminal.PtyOutput = (function() {

        /**
         * Properties of a PtyOutput.
         * @memberof terminal
         * @interface IPtyOutput
         * @property {string|null} [data] PtyOutput data
         * @property {string|null} [clientId] PtyOutput clientId
         */

        /**
         * Constructs a new PtyOutput.
         * @memberof terminal
         * @classdesc Represents a PtyOutput.
         * @implements IPtyOutput
         * @constructor
         * @param {terminal.IPtyOutput=} [properties] Properties to set
         */
        function PtyOutput(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PtyOutput data.
         * @member {string} data
         * @memberof terminal.PtyOutput
         * @instance
         */
        PtyOutput.prototype.data = "";

        /**
         * PtyOutput clientId.
         * @member {string} clientId
         * @memberof terminal.PtyOutput
         * @instance
         */
        PtyOutput.prototype.clientId = "";

        /**
         * Creates a new PtyOutput instance using the specified properties.
         * @function create
         * @memberof terminal.PtyOutput
         * @static
         * @param {terminal.IPtyOutput=} [properties] Properties to set
         * @returns {terminal.PtyOutput} PtyOutput instance
         */
        PtyOutput.create = function create(properties) {
            return new PtyOutput(properties);
        };

        /**
         * Encodes the specified PtyOutput message. Does not implicitly {@link terminal.PtyOutput.verify|verify} messages.
         * @function encode
         * @memberof terminal.PtyOutput
         * @static
         * @param {terminal.IPtyOutput} message PtyOutput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PtyOutput.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.data);
            if (message.clientId != null && Object.hasOwnProperty.call(message, "clientId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.clientId);
            return writer;
        };

        /**
         * Encodes the specified PtyOutput message, length delimited. Does not implicitly {@link terminal.PtyOutput.verify|verify} messages.
         * @function encodeDelimited
         * @memberof terminal.PtyOutput
         * @static
         * @param {terminal.IPtyOutput} message PtyOutput message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PtyOutput.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PtyOutput message from the specified reader or buffer.
         * @function decode
         * @memberof terminal.PtyOutput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {terminal.PtyOutput} PtyOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PtyOutput.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.terminal.PtyOutput();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.data = reader.string();
                        break;
                    }
                case 2: {
                        message.clientId = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PtyOutput message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof terminal.PtyOutput
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {terminal.PtyOutput} PtyOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PtyOutput.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PtyOutput message.
         * @function verify
         * @memberof terminal.PtyOutput
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PtyOutput.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.data != null && message.hasOwnProperty("data"))
                if (!$util.isString(message.data))
                    return "data: string expected";
            if (message.clientId != null && message.hasOwnProperty("clientId"))
                if (!$util.isString(message.clientId))
                    return "clientId: string expected";
            return null;
        };

        /**
         * Creates a PtyOutput message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof terminal.PtyOutput
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {terminal.PtyOutput} PtyOutput
         */
        PtyOutput.fromObject = function fromObject(object) {
            if (object instanceof $root.terminal.PtyOutput)
                return object;
            let message = new $root.terminal.PtyOutput();
            if (object.data != null)
                message.data = String(object.data);
            if (object.clientId != null)
                message.clientId = String(object.clientId);
            return message;
        };

        /**
         * Creates a plain object from a PtyOutput message. Also converts values to other types if specified.
         * @function toObject
         * @memberof terminal.PtyOutput
         * @static
         * @param {terminal.PtyOutput} message PtyOutput
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PtyOutput.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.data = "";
                object.clientId = "";
            }
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = message.data;
            if (message.clientId != null && message.hasOwnProperty("clientId"))
                object.clientId = message.clientId;
            return object;
        };

        /**
         * Converts this PtyOutput to JSON.
         * @function toJSON
         * @memberof terminal.PtyOutput
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PtyOutput.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for PtyOutput
         * @function getTypeUrl
         * @memberof terminal.PtyOutput
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PtyOutput.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/terminal.PtyOutput";
        };

        return PtyOutput;
    })();

    terminal.PtyExit = (function() {

        /**
         * Properties of a PtyExit.
         * @memberof terminal
         * @interface IPtyExit
         * @property {number|null} [code] PtyExit code
         * @property {string|null} [clientId] PtyExit clientId
         */

        /**
         * Constructs a new PtyExit.
         * @memberof terminal
         * @classdesc Represents a PtyExit.
         * @implements IPtyExit
         * @constructor
         * @param {terminal.IPtyExit=} [properties] Properties to set
         */
        function PtyExit(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PtyExit code.
         * @member {number} code
         * @memberof terminal.PtyExit
         * @instance
         */
        PtyExit.prototype.code = 0;

        /**
         * PtyExit clientId.
         * @member {string} clientId
         * @memberof terminal.PtyExit
         * @instance
         */
        PtyExit.prototype.clientId = "";

        /**
         * Creates a new PtyExit instance using the specified properties.
         * @function create
         * @memberof terminal.PtyExit
         * @static
         * @param {terminal.IPtyExit=} [properties] Properties to set
         * @returns {terminal.PtyExit} PtyExit instance
         */
        PtyExit.create = function create(properties) {
            return new PtyExit(properties);
        };

        /**
         * Encodes the specified PtyExit message. Does not implicitly {@link terminal.PtyExit.verify|verify} messages.
         * @function encode
         * @memberof terminal.PtyExit
         * @static
         * @param {terminal.IPtyExit} message PtyExit message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PtyExit.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.code);
            if (message.clientId != null && Object.hasOwnProperty.call(message, "clientId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.clientId);
            return writer;
        };

        /**
         * Encodes the specified PtyExit message, length delimited. Does not implicitly {@link terminal.PtyExit.verify|verify} messages.
         * @function encodeDelimited
         * @memberof terminal.PtyExit
         * @static
         * @param {terminal.IPtyExit} message PtyExit message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PtyExit.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PtyExit message from the specified reader or buffer.
         * @function decode
         * @memberof terminal.PtyExit
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {terminal.PtyExit} PtyExit
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PtyExit.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.terminal.PtyExit();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.code = reader.int32();
                        break;
                    }
                case 2: {
                        message.clientId = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PtyExit message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof terminal.PtyExit
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {terminal.PtyExit} PtyExit
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PtyExit.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PtyExit message.
         * @function verify
         * @memberof terminal.PtyExit
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PtyExit.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isInteger(message.code))
                    return "code: integer expected";
            if (message.clientId != null && message.hasOwnProperty("clientId"))
                if (!$util.isString(message.clientId))
                    return "clientId: string expected";
            return null;
        };

        /**
         * Creates a PtyExit message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof terminal.PtyExit
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {terminal.PtyExit} PtyExit
         */
        PtyExit.fromObject = function fromObject(object) {
            if (object instanceof $root.terminal.PtyExit)
                return object;
            let message = new $root.terminal.PtyExit();
            if (object.code != null)
                message.code = object.code | 0;
            if (object.clientId != null)
                message.clientId = String(object.clientId);
            return message;
        };

        /**
         * Creates a plain object from a PtyExit message. Also converts values to other types if specified.
         * @function toObject
         * @memberof terminal.PtyExit
         * @static
         * @param {terminal.PtyExit} message PtyExit
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PtyExit.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.code = 0;
                object.clientId = "";
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.clientId != null && message.hasOwnProperty("clientId"))
                object.clientId = message.clientId;
            return object;
        };

        /**
         * Converts this PtyExit to JSON.
         * @function toJSON
         * @memberof terminal.PtyExit
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PtyExit.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for PtyExit
         * @function getTypeUrl
         * @memberof terminal.PtyExit
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        PtyExit.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/terminal.PtyExit";
        };

        return PtyExit;
    })();

    terminal.SystemMessage = (function() {

        /**
         * Properties of a SystemMessage.
         * @memberof terminal
         * @interface ISystemMessage
         * @property {string|null} [message] SystemMessage message
         */

        /**
         * Constructs a new SystemMessage.
         * @memberof terminal
         * @classdesc Represents a SystemMessage.
         * @implements ISystemMessage
         * @constructor
         * @param {terminal.ISystemMessage=} [properties] Properties to set
         */
        function SystemMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SystemMessage message.
         * @member {string} message
         * @memberof terminal.SystemMessage
         * @instance
         */
        SystemMessage.prototype.message = "";

        /**
         * Creates a new SystemMessage instance using the specified properties.
         * @function create
         * @memberof terminal.SystemMessage
         * @static
         * @param {terminal.ISystemMessage=} [properties] Properties to set
         * @returns {terminal.SystemMessage} SystemMessage instance
         */
        SystemMessage.create = function create(properties) {
            return new SystemMessage(properties);
        };

        /**
         * Encodes the specified SystemMessage message. Does not implicitly {@link terminal.SystemMessage.verify|verify} messages.
         * @function encode
         * @memberof terminal.SystemMessage
         * @static
         * @param {terminal.ISystemMessage} message SystemMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SystemMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.message);
            return writer;
        };

        /**
         * Encodes the specified SystemMessage message, length delimited. Does not implicitly {@link terminal.SystemMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof terminal.SystemMessage
         * @static
         * @param {terminal.ISystemMessage} message SystemMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SystemMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SystemMessage message from the specified reader or buffer.
         * @function decode
         * @memberof terminal.SystemMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {terminal.SystemMessage} SystemMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SystemMessage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.terminal.SystemMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.message = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SystemMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof terminal.SystemMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {terminal.SystemMessage} SystemMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SystemMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SystemMessage message.
         * @function verify
         * @memberof terminal.SystemMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SystemMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            return null;
        };

        /**
         * Creates a SystemMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof terminal.SystemMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {terminal.SystemMessage} SystemMessage
         */
        SystemMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.terminal.SystemMessage)
                return object;
            let message = new $root.terminal.SystemMessage();
            if (object.message != null)
                message.message = String(object.message);
            return message;
        };

        /**
         * Creates a plain object from a SystemMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof terminal.SystemMessage
         * @static
         * @param {terminal.SystemMessage} message SystemMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SystemMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.message = "";
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            return object;
        };

        /**
         * Converts this SystemMessage to JSON.
         * @function toJSON
         * @memberof terminal.SystemMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SystemMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SystemMessage
         * @function getTypeUrl
         * @memberof terminal.SystemMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SystemMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/terminal.SystemMessage";
        };

        return SystemMessage;
    })();

    terminal.ErrorMessage = (function() {

        /**
         * Properties of an ErrorMessage.
         * @memberof terminal
         * @interface IErrorMessage
         * @property {string|null} [message] ErrorMessage message
         */

        /**
         * Constructs a new ErrorMessage.
         * @memberof terminal
         * @classdesc Represents an ErrorMessage.
         * @implements IErrorMessage
         * @constructor
         * @param {terminal.IErrorMessage=} [properties] Properties to set
         */
        function ErrorMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ErrorMessage message.
         * @member {string} message
         * @memberof terminal.ErrorMessage
         * @instance
         */
        ErrorMessage.prototype.message = "";

        /**
         * Creates a new ErrorMessage instance using the specified properties.
         * @function create
         * @memberof terminal.ErrorMessage
         * @static
         * @param {terminal.IErrorMessage=} [properties] Properties to set
         * @returns {terminal.ErrorMessage} ErrorMessage instance
         */
        ErrorMessage.create = function create(properties) {
            return new ErrorMessage(properties);
        };

        /**
         * Encodes the specified ErrorMessage message. Does not implicitly {@link terminal.ErrorMessage.verify|verify} messages.
         * @function encode
         * @memberof terminal.ErrorMessage
         * @static
         * @param {terminal.IErrorMessage} message ErrorMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ErrorMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.message);
            return writer;
        };

        /**
         * Encodes the specified ErrorMessage message, length delimited. Does not implicitly {@link terminal.ErrorMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof terminal.ErrorMessage
         * @static
         * @param {terminal.IErrorMessage} message ErrorMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ErrorMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ErrorMessage message from the specified reader or buffer.
         * @function decode
         * @memberof terminal.ErrorMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {terminal.ErrorMessage} ErrorMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ErrorMessage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.terminal.ErrorMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.message = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ErrorMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof terminal.ErrorMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {terminal.ErrorMessage} ErrorMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ErrorMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ErrorMessage message.
         * @function verify
         * @memberof terminal.ErrorMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ErrorMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            return null;
        };

        /**
         * Creates an ErrorMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof terminal.ErrorMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {terminal.ErrorMessage} ErrorMessage
         */
        ErrorMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.terminal.ErrorMessage)
                return object;
            let message = new $root.terminal.ErrorMessage();
            if (object.message != null)
                message.message = String(object.message);
            return message;
        };

        /**
         * Creates a plain object from an ErrorMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof terminal.ErrorMessage
         * @static
         * @param {terminal.ErrorMessage} message ErrorMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ErrorMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.message = "";
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            return object;
        };

        /**
         * Converts this ErrorMessage to JSON.
         * @function toJSON
         * @memberof terminal.ErrorMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ErrorMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ErrorMessage
         * @function getTypeUrl
         * @memberof terminal.ErrorMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ErrorMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/terminal.ErrorMessage";
        };

        return ErrorMessage;
    })();

    terminal.ScreenFrame = (function() {

        /**
         * Properties of a ScreenFrame.
         * @memberof terminal
         * @interface IScreenFrame
         * @property {Uint8Array|null} [data] ScreenFrame data
         * @property {number|null} [width] ScreenFrame width
         * @property {number|null} [height] ScreenFrame height
         */

        /**
         * Constructs a new ScreenFrame.
         * @memberof terminal
         * @classdesc Represents a ScreenFrame.
         * @implements IScreenFrame
         * @constructor
         * @param {terminal.IScreenFrame=} [properties] Properties to set
         */
        function ScreenFrame(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ScreenFrame data.
         * @member {Uint8Array} data
         * @memberof terminal.ScreenFrame
         * @instance
         */
        ScreenFrame.prototype.data = $util.newBuffer([]);

        /**
         * ScreenFrame width.
         * @member {number} width
         * @memberof terminal.ScreenFrame
         * @instance
         */
        ScreenFrame.prototype.width = 0;

        /**
         * ScreenFrame height.
         * @member {number} height
         * @memberof terminal.ScreenFrame
         * @instance
         */
        ScreenFrame.prototype.height = 0;

        /**
         * Creates a new ScreenFrame instance using the specified properties.
         * @function create
         * @memberof terminal.ScreenFrame
         * @static
         * @param {terminal.IScreenFrame=} [properties] Properties to set
         * @returns {terminal.ScreenFrame} ScreenFrame instance
         */
        ScreenFrame.create = function create(properties) {
            return new ScreenFrame(properties);
        };

        /**
         * Encodes the specified ScreenFrame message. Does not implicitly {@link terminal.ScreenFrame.verify|verify} messages.
         * @function encode
         * @memberof terminal.ScreenFrame
         * @static
         * @param {terminal.IScreenFrame} message ScreenFrame message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ScreenFrame.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.data);
            if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.width);
            if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.height);
            return writer;
        };

        /**
         * Encodes the specified ScreenFrame message, length delimited. Does not implicitly {@link terminal.ScreenFrame.verify|verify} messages.
         * @function encodeDelimited
         * @memberof terminal.ScreenFrame
         * @static
         * @param {terminal.IScreenFrame} message ScreenFrame message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ScreenFrame.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ScreenFrame message from the specified reader or buffer.
         * @function decode
         * @memberof terminal.ScreenFrame
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {terminal.ScreenFrame} ScreenFrame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ScreenFrame.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.terminal.ScreenFrame();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.data = reader.bytes();
                        break;
                    }
                case 2: {
                        message.width = reader.uint32();
                        break;
                    }
                case 3: {
                        message.height = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ScreenFrame message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof terminal.ScreenFrame
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {terminal.ScreenFrame} ScreenFrame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ScreenFrame.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ScreenFrame message.
         * @function verify
         * @memberof terminal.ScreenFrame
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ScreenFrame.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.data != null && message.hasOwnProperty("data"))
                if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                    return "data: buffer expected";
            if (message.width != null && message.hasOwnProperty("width"))
                if (!$util.isInteger(message.width))
                    return "width: integer expected";
            if (message.height != null && message.hasOwnProperty("height"))
                if (!$util.isInteger(message.height))
                    return "height: integer expected";
            return null;
        };

        /**
         * Creates a ScreenFrame message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof terminal.ScreenFrame
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {terminal.ScreenFrame} ScreenFrame
         */
        ScreenFrame.fromObject = function fromObject(object) {
            if (object instanceof $root.terminal.ScreenFrame)
                return object;
            let message = new $root.terminal.ScreenFrame();
            if (object.data != null)
                if (typeof object.data === "string")
                    $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                else if (object.data.length >= 0)
                    message.data = object.data;
            if (object.width != null)
                message.width = object.width >>> 0;
            if (object.height != null)
                message.height = object.height >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a ScreenFrame message. Also converts values to other types if specified.
         * @function toObject
         * @memberof terminal.ScreenFrame
         * @static
         * @param {terminal.ScreenFrame} message ScreenFrame
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ScreenFrame.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.data = "";
                else {
                    object.data = [];
                    if (options.bytes !== Array)
                        object.data = $util.newBuffer(object.data);
                }
                object.width = 0;
                object.height = 0;
            }
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
            if (message.width != null && message.hasOwnProperty("width"))
                object.width = message.width;
            if (message.height != null && message.hasOwnProperty("height"))
                object.height = message.height;
            return object;
        };

        /**
         * Converts this ScreenFrame to JSON.
         * @function toJSON
         * @memberof terminal.ScreenFrame
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ScreenFrame.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ScreenFrame
         * @function getTypeUrl
         * @memberof terminal.ScreenFrame
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ScreenFrame.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/terminal.ScreenFrame";
        };

        return ScreenFrame;
    })();

    terminal.ToggleScreenRequest = (function() {

        /**
         * Properties of a ToggleScreenRequest.
         * @memberof terminal
         * @interface IToggleScreenRequest
         * @property {boolean|null} [enabled] ToggleScreenRequest enabled
         */

        /**
         * Constructs a new ToggleScreenRequest.
         * @memberof terminal
         * @classdesc Represents a ToggleScreenRequest.
         * @implements IToggleScreenRequest
         * @constructor
         * @param {terminal.IToggleScreenRequest=} [properties] Properties to set
         */
        function ToggleScreenRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ToggleScreenRequest enabled.
         * @member {boolean} enabled
         * @memberof terminal.ToggleScreenRequest
         * @instance
         */
        ToggleScreenRequest.prototype.enabled = false;

        /**
         * Creates a new ToggleScreenRequest instance using the specified properties.
         * @function create
         * @memberof terminal.ToggleScreenRequest
         * @static
         * @param {terminal.IToggleScreenRequest=} [properties] Properties to set
         * @returns {terminal.ToggleScreenRequest} ToggleScreenRequest instance
         */
        ToggleScreenRequest.create = function create(properties) {
            return new ToggleScreenRequest(properties);
        };

        /**
         * Encodes the specified ToggleScreenRequest message. Does not implicitly {@link terminal.ToggleScreenRequest.verify|verify} messages.
         * @function encode
         * @memberof terminal.ToggleScreenRequest
         * @static
         * @param {terminal.IToggleScreenRequest} message ToggleScreenRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ToggleScreenRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.enabled != null && Object.hasOwnProperty.call(message, "enabled"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.enabled);
            return writer;
        };

        /**
         * Encodes the specified ToggleScreenRequest message, length delimited. Does not implicitly {@link terminal.ToggleScreenRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof terminal.ToggleScreenRequest
         * @static
         * @param {terminal.IToggleScreenRequest} message ToggleScreenRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ToggleScreenRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ToggleScreenRequest message from the specified reader or buffer.
         * @function decode
         * @memberof terminal.ToggleScreenRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {terminal.ToggleScreenRequest} ToggleScreenRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ToggleScreenRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.terminal.ToggleScreenRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.enabled = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ToggleScreenRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof terminal.ToggleScreenRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {terminal.ToggleScreenRequest} ToggleScreenRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ToggleScreenRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ToggleScreenRequest message.
         * @function verify
         * @memberof terminal.ToggleScreenRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ToggleScreenRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.enabled != null && message.hasOwnProperty("enabled"))
                if (typeof message.enabled !== "boolean")
                    return "enabled: boolean expected";
            return null;
        };

        /**
         * Creates a ToggleScreenRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof terminal.ToggleScreenRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {terminal.ToggleScreenRequest} ToggleScreenRequest
         */
        ToggleScreenRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.terminal.ToggleScreenRequest)
                return object;
            let message = new $root.terminal.ToggleScreenRequest();
            if (object.enabled != null)
                message.enabled = Boolean(object.enabled);
            return message;
        };

        /**
         * Creates a plain object from a ToggleScreenRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof terminal.ToggleScreenRequest
         * @static
         * @param {terminal.ToggleScreenRequest} message ToggleScreenRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ToggleScreenRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.enabled = false;
            if (message.enabled != null && message.hasOwnProperty("enabled"))
                object.enabled = message.enabled;
            return object;
        };

        /**
         * Converts this ToggleScreenRequest to JSON.
         * @function toJSON
         * @memberof terminal.ToggleScreenRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ToggleScreenRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ToggleScreenRequest
         * @function getTypeUrl
         * @memberof terminal.ToggleScreenRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ToggleScreenRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/terminal.ToggleScreenRequest";
        };

        return ToggleScreenRequest;
    })();

    terminal.ToggleAdminRequest = (function() {

        /**
         * Properties of a ToggleAdminRequest.
         * @memberof terminal
         * @interface IToggleAdminRequest
         * @property {boolean|null} [enabled] ToggleAdminRequest enabled
         */

        /**
         * Constructs a new ToggleAdminRequest.
         * @memberof terminal
         * @classdesc Represents a ToggleAdminRequest.
         * @implements IToggleAdminRequest
         * @constructor
         * @param {terminal.IToggleAdminRequest=} [properties] Properties to set
         */
        function ToggleAdminRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ToggleAdminRequest enabled.
         * @member {boolean} enabled
         * @memberof terminal.ToggleAdminRequest
         * @instance
         */
        ToggleAdminRequest.prototype.enabled = false;

        /**
         * Creates a new ToggleAdminRequest instance using the specified properties.
         * @function create
         * @memberof terminal.ToggleAdminRequest
         * @static
         * @param {terminal.IToggleAdminRequest=} [properties] Properties to set
         * @returns {terminal.ToggleAdminRequest} ToggleAdminRequest instance
         */
        ToggleAdminRequest.create = function create(properties) {
            return new ToggleAdminRequest(properties);
        };

        /**
         * Encodes the specified ToggleAdminRequest message. Does not implicitly {@link terminal.ToggleAdminRequest.verify|verify} messages.
         * @function encode
         * @memberof terminal.ToggleAdminRequest
         * @static
         * @param {terminal.IToggleAdminRequest} message ToggleAdminRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ToggleAdminRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.enabled != null && Object.hasOwnProperty.call(message, "enabled"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.enabled);
            return writer;
        };

        /**
         * Encodes the specified ToggleAdminRequest message, length delimited. Does not implicitly {@link terminal.ToggleAdminRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof terminal.ToggleAdminRequest
         * @static
         * @param {terminal.IToggleAdminRequest} message ToggleAdminRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ToggleAdminRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ToggleAdminRequest message from the specified reader or buffer.
         * @function decode
         * @memberof terminal.ToggleAdminRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {terminal.ToggleAdminRequest} ToggleAdminRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ToggleAdminRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.terminal.ToggleAdminRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.enabled = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ToggleAdminRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof terminal.ToggleAdminRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {terminal.ToggleAdminRequest} ToggleAdminRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ToggleAdminRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ToggleAdminRequest message.
         * @function verify
         * @memberof terminal.ToggleAdminRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ToggleAdminRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.enabled != null && message.hasOwnProperty("enabled"))
                if (typeof message.enabled !== "boolean")
                    return "enabled: boolean expected";
            return null;
        };

        /**
         * Creates a ToggleAdminRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof terminal.ToggleAdminRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {terminal.ToggleAdminRequest} ToggleAdminRequest
         */
        ToggleAdminRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.terminal.ToggleAdminRequest)
                return object;
            let message = new $root.terminal.ToggleAdminRequest();
            if (object.enabled != null)
                message.enabled = Boolean(object.enabled);
            return message;
        };

        /**
         * Creates a plain object from a ToggleAdminRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof terminal.ToggleAdminRequest
         * @static
         * @param {terminal.ToggleAdminRequest} message ToggleAdminRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ToggleAdminRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.enabled = false;
            if (message.enabled != null && message.hasOwnProperty("enabled"))
                object.enabled = message.enabled;
            return object;
        };

        /**
         * Converts this ToggleAdminRequest to JSON.
         * @function toJSON
         * @memberof terminal.ToggleAdminRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ToggleAdminRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ToggleAdminRequest
         * @function getTypeUrl
         * @memberof terminal.ToggleAdminRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ToggleAdminRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/terminal.ToggleAdminRequest";
        };

        return ToggleAdminRequest;
    })();

    terminal.HostCapabilities = (function() {

        /**
         * Properties of a HostCapabilities.
         * @memberof terminal
         * @interface IHostCapabilities
         * @property {boolean|null} [supportsScreenShare] HostCapabilities supportsScreenShare
         * @property {boolean|null} [supportsAdminMode] HostCapabilities supportsAdminMode
         * @property {boolean|null} [isAdmin] HostCapabilities isAdmin
         */

        /**
         * Constructs a new HostCapabilities.
         * @memberof terminal
         * @classdesc Represents a HostCapabilities.
         * @implements IHostCapabilities
         * @constructor
         * @param {terminal.IHostCapabilities=} [properties] Properties to set
         */
        function HostCapabilities(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HostCapabilities supportsScreenShare.
         * @member {boolean} supportsScreenShare
         * @memberof terminal.HostCapabilities
         * @instance
         */
        HostCapabilities.prototype.supportsScreenShare = false;

        /**
         * HostCapabilities supportsAdminMode.
         * @member {boolean} supportsAdminMode
         * @memberof terminal.HostCapabilities
         * @instance
         */
        HostCapabilities.prototype.supportsAdminMode = false;

        /**
         * HostCapabilities isAdmin.
         * @member {boolean} isAdmin
         * @memberof terminal.HostCapabilities
         * @instance
         */
        HostCapabilities.prototype.isAdmin = false;

        /**
         * Creates a new HostCapabilities instance using the specified properties.
         * @function create
         * @memberof terminal.HostCapabilities
         * @static
         * @param {terminal.IHostCapabilities=} [properties] Properties to set
         * @returns {terminal.HostCapabilities} HostCapabilities instance
         */
        HostCapabilities.create = function create(properties) {
            return new HostCapabilities(properties);
        };

        /**
         * Encodes the specified HostCapabilities message. Does not implicitly {@link terminal.HostCapabilities.verify|verify} messages.
         * @function encode
         * @memberof terminal.HostCapabilities
         * @static
         * @param {terminal.IHostCapabilities} message HostCapabilities message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HostCapabilities.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.supportsScreenShare != null && Object.hasOwnProperty.call(message, "supportsScreenShare"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.supportsScreenShare);
            if (message.supportsAdminMode != null && Object.hasOwnProperty.call(message, "supportsAdminMode"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.supportsAdminMode);
            if (message.isAdmin != null && Object.hasOwnProperty.call(message, "isAdmin"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.isAdmin);
            return writer;
        };

        /**
         * Encodes the specified HostCapabilities message, length delimited. Does not implicitly {@link terminal.HostCapabilities.verify|verify} messages.
         * @function encodeDelimited
         * @memberof terminal.HostCapabilities
         * @static
         * @param {terminal.IHostCapabilities} message HostCapabilities message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HostCapabilities.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HostCapabilities message from the specified reader or buffer.
         * @function decode
         * @memberof terminal.HostCapabilities
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {terminal.HostCapabilities} HostCapabilities
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HostCapabilities.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.terminal.HostCapabilities();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.supportsScreenShare = reader.bool();
                        break;
                    }
                case 2: {
                        message.supportsAdminMode = reader.bool();
                        break;
                    }
                case 3: {
                        message.isAdmin = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HostCapabilities message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof terminal.HostCapabilities
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {terminal.HostCapabilities} HostCapabilities
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HostCapabilities.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HostCapabilities message.
         * @function verify
         * @memberof terminal.HostCapabilities
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HostCapabilities.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.supportsScreenShare != null && message.hasOwnProperty("supportsScreenShare"))
                if (typeof message.supportsScreenShare !== "boolean")
                    return "supportsScreenShare: boolean expected";
            if (message.supportsAdminMode != null && message.hasOwnProperty("supportsAdminMode"))
                if (typeof message.supportsAdminMode !== "boolean")
                    return "supportsAdminMode: boolean expected";
            if (message.isAdmin != null && message.hasOwnProperty("isAdmin"))
                if (typeof message.isAdmin !== "boolean")
                    return "isAdmin: boolean expected";
            return null;
        };

        /**
         * Creates a HostCapabilities message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof terminal.HostCapabilities
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {terminal.HostCapabilities} HostCapabilities
         */
        HostCapabilities.fromObject = function fromObject(object) {
            if (object instanceof $root.terminal.HostCapabilities)
                return object;
            let message = new $root.terminal.HostCapabilities();
            if (object.supportsScreenShare != null)
                message.supportsScreenShare = Boolean(object.supportsScreenShare);
            if (object.supportsAdminMode != null)
                message.supportsAdminMode = Boolean(object.supportsAdminMode);
            if (object.isAdmin != null)
                message.isAdmin = Boolean(object.isAdmin);
            return message;
        };

        /**
         * Creates a plain object from a HostCapabilities message. Also converts values to other types if specified.
         * @function toObject
         * @memberof terminal.HostCapabilities
         * @static
         * @param {terminal.HostCapabilities} message HostCapabilities
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HostCapabilities.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.supportsScreenShare = false;
                object.supportsAdminMode = false;
                object.isAdmin = false;
            }
            if (message.supportsScreenShare != null && message.hasOwnProperty("supportsScreenShare"))
                object.supportsScreenShare = message.supportsScreenShare;
            if (message.supportsAdminMode != null && message.hasOwnProperty("supportsAdminMode"))
                object.supportsAdminMode = message.supportsAdminMode;
            if (message.isAdmin != null && message.hasOwnProperty("isAdmin"))
                object.isAdmin = message.isAdmin;
            return object;
        };

        /**
         * Converts this HostCapabilities to JSON.
         * @function toJSON
         * @memberof terminal.HostCapabilities
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HostCapabilities.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for HostCapabilities
         * @function getTypeUrl
         * @memberof terminal.HostCapabilities
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        HostCapabilities.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/terminal.HostCapabilities";
        };

        return HostCapabilities;
    })();

    return terminal;
})();

export { $root as default };
