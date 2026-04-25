import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace terminal. */
export namespace terminal {

    /** Properties of a ClientMessage. */
    interface IClientMessage {

        /** ClientMessage authRequest */
        authRequest?: (terminal.IAuthRequest|null);

        /** ClientMessage ptyInput */
        ptyInput?: (terminal.IPtyInput|null);

        /** ClientMessage ptyResize */
        ptyResize?: (terminal.IPtyResize|null);

        /** ClientMessage clientId */
        clientId?: (string|null);
    }

    /** Represents a ClientMessage. */
    class ClientMessage implements IClientMessage {

        /**
         * Constructs a new ClientMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: terminal.IClientMessage);

        /** ClientMessage authRequest. */
        public authRequest?: (terminal.IAuthRequest|null);

        /** ClientMessage ptyInput. */
        public ptyInput?: (terminal.IPtyInput|null);

        /** ClientMessage ptyResize. */
        public ptyResize?: (terminal.IPtyResize|null);

        /** ClientMessage clientId. */
        public clientId: string;

        /** ClientMessage payload. */
        public payload?: ("authRequest"|"ptyInput"|"ptyResize");

        /**
         * Creates a new ClientMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ClientMessage instance
         */
        public static create(properties?: terminal.IClientMessage): terminal.ClientMessage;

        /**
         * Encodes the specified ClientMessage message. Does not implicitly {@link terminal.ClientMessage.verify|verify} messages.
         * @param message ClientMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: terminal.IClientMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ClientMessage message, length delimited. Does not implicitly {@link terminal.ClientMessage.verify|verify} messages.
         * @param message ClientMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: terminal.IClientMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ClientMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ClientMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): terminal.ClientMessage;

        /**
         * Decodes a ClientMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ClientMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): terminal.ClientMessage;

        /**
         * Verifies a ClientMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ClientMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ClientMessage
         */
        public static fromObject(object: { [k: string]: any }): terminal.ClientMessage;

        /**
         * Creates a plain object from a ClientMessage message. Also converts values to other types if specified.
         * @param message ClientMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: terminal.ClientMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ClientMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ClientMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ServerMessage. */
    interface IServerMessage {

        /** ServerMessage authResponse */
        authResponse?: (terminal.IAuthResponse|null);

        /** ServerMessage registerHostResponse */
        registerHostResponse?: (terminal.IRegisterHostResponse|null);

        /** ServerMessage ptyOutput */
        ptyOutput?: (terminal.IPtyOutput|null);

        /** ServerMessage ptyExit */
        ptyExit?: (terminal.IPtyExit|null);

        /** ServerMessage systemMessage */
        systemMessage?: (terminal.ISystemMessage|null);

        /** ServerMessage errorMessage */
        errorMessage?: (terminal.IErrorMessage|null);

        /** ServerMessage screenFrame */
        screenFrame?: (terminal.IScreenFrame|null);
    }

    /** Represents a ServerMessage. */
    class ServerMessage implements IServerMessage {

        /**
         * Constructs a new ServerMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: terminal.IServerMessage);

        /** ServerMessage authResponse. */
        public authResponse?: (terminal.IAuthResponse|null);

        /** ServerMessage registerHostResponse. */
        public registerHostResponse?: (terminal.IRegisterHostResponse|null);

        /** ServerMessage ptyOutput. */
        public ptyOutput?: (terminal.IPtyOutput|null);

        /** ServerMessage ptyExit. */
        public ptyExit?: (terminal.IPtyExit|null);

        /** ServerMessage systemMessage. */
        public systemMessage?: (terminal.ISystemMessage|null);

        /** ServerMessage errorMessage. */
        public errorMessage?: (terminal.IErrorMessage|null);

        /** ServerMessage screenFrame. */
        public screenFrame?: (terminal.IScreenFrame|null);

        /** ServerMessage payload. */
        public payload?: ("authResponse"|"registerHostResponse"|"ptyOutput"|"ptyExit"|"systemMessage"|"errorMessage"|"screenFrame");

        /**
         * Creates a new ServerMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ServerMessage instance
         */
        public static create(properties?: terminal.IServerMessage): terminal.ServerMessage;

        /**
         * Encodes the specified ServerMessage message. Does not implicitly {@link terminal.ServerMessage.verify|verify} messages.
         * @param message ServerMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: terminal.IServerMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ServerMessage message, length delimited. Does not implicitly {@link terminal.ServerMessage.verify|verify} messages.
         * @param message ServerMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: terminal.IServerMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ServerMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ServerMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): terminal.ServerMessage;

        /**
         * Decodes a ServerMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ServerMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): terminal.ServerMessage;

        /**
         * Verifies a ServerMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ServerMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ServerMessage
         */
        public static fromObject(object: { [k: string]: any }): terminal.ServerMessage;

        /**
         * Creates a plain object from a ServerMessage message. Also converts values to other types if specified.
         * @param message ServerMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: terminal.ServerMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ServerMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ServerMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a HostMessage. */
    interface IHostMessage {

        /** HostMessage authRequest */
        authRequest?: (terminal.IAuthRequest|null);

        /** HostMessage registerHost */
        registerHost?: (terminal.IRegisterHostRequest|null);

        /** HostMessage ptyOutput */
        ptyOutput?: (terminal.IPtyOutput|null);

        /** HostMessage ptyExit */
        ptyExit?: (terminal.IPtyExit|null);

        /** HostMessage screenFrame */
        screenFrame?: (terminal.IScreenFrame|null);

        /** HostMessage capabilities */
        capabilities?: (terminal.IHostCapabilities|null);

        /** HostMessage toggleScreen */
        toggleScreen?: (terminal.IToggleScreenStatus|null);

        /** HostMessage toggleAdmin */
        toggleAdmin?: (terminal.IToggleAdminStatus|null);
    }

    /** Represents a HostMessage. */
    class HostMessage implements IHostMessage {

        /**
         * Constructs a new HostMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: terminal.IHostMessage);

        /** HostMessage authRequest. */
        public authRequest?: (terminal.IAuthRequest|null);

        /** HostMessage registerHost. */
        public registerHost?: (terminal.IRegisterHostRequest|null);

        /** HostMessage ptyOutput. */
        public ptyOutput?: (terminal.IPtyOutput|null);

        /** HostMessage ptyExit. */
        public ptyExit?: (terminal.IPtyExit|null);

        /** HostMessage screenFrame. */
        public screenFrame?: (terminal.IScreenFrame|null);

        /** HostMessage capabilities. */
        public capabilities?: (terminal.IHostCapabilities|null);

        /** HostMessage toggleScreen. */
        public toggleScreen?: (terminal.IToggleScreenStatus|null);

        /** HostMessage toggleAdmin. */
        public toggleAdmin?: (terminal.IToggleAdminStatus|null);

        /** HostMessage payload. */
        public payload?: ("authRequest"|"registerHost"|"ptyOutput"|"ptyExit"|"screenFrame"|"capabilities"|"toggleScreen"|"toggleAdmin");

        /**
         * Creates a new HostMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HostMessage instance
         */
        public static create(properties?: terminal.IHostMessage): terminal.HostMessage;

        /**
         * Encodes the specified HostMessage message. Does not implicitly {@link terminal.HostMessage.verify|verify} messages.
         * @param message HostMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: terminal.IHostMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HostMessage message, length delimited. Does not implicitly {@link terminal.HostMessage.verify|verify} messages.
         * @param message HostMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: terminal.IHostMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HostMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HostMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): terminal.HostMessage;

        /**
         * Decodes a HostMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HostMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): terminal.HostMessage;

        /**
         * Verifies a HostMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HostMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HostMessage
         */
        public static fromObject(object: { [k: string]: any }): terminal.HostMessage;

        /**
         * Creates a plain object from a HostMessage message. Also converts values to other types if specified.
         * @param message HostMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: terminal.HostMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HostMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for HostMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AuthRequest. */
    interface IAuthRequest {

        /** AuthRequest hostId */
        hostId?: (string|null);

        /** AuthRequest token */
        token?: (string|null);
    }

    /** Represents an AuthRequest. */
    class AuthRequest implements IAuthRequest {

        /**
         * Constructs a new AuthRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: terminal.IAuthRequest);

        /** AuthRequest hostId. */
        public hostId: string;

        /** AuthRequest token. */
        public token: string;

        /**
         * Creates a new AuthRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AuthRequest instance
         */
        public static create(properties?: terminal.IAuthRequest): terminal.AuthRequest;

        /**
         * Encodes the specified AuthRequest message. Does not implicitly {@link terminal.AuthRequest.verify|verify} messages.
         * @param message AuthRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: terminal.IAuthRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AuthRequest message, length delimited. Does not implicitly {@link terminal.AuthRequest.verify|verify} messages.
         * @param message AuthRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: terminal.IAuthRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AuthRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AuthRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): terminal.AuthRequest;

        /**
         * Decodes an AuthRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AuthRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): terminal.AuthRequest;

        /**
         * Verifies an AuthRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AuthRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AuthRequest
         */
        public static fromObject(object: { [k: string]: any }): terminal.AuthRequest;

        /**
         * Creates a plain object from an AuthRequest message. Also converts values to other types if specified.
         * @param message AuthRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: terminal.AuthRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AuthRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AuthRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an AuthResponse. */
    interface IAuthResponse {

        /** AuthResponse ok */
        ok?: (boolean|null);

        /** AuthResponse error */
        error?: (string|null);

        /** AuthResponse isAdminActive */
        isAdminActive?: (boolean|null);

        /** AuthResponse isScreenActive */
        isScreenActive?: (boolean|null);
    }

    /** Represents an AuthResponse. */
    class AuthResponse implements IAuthResponse {

        /**
         * Constructs a new AuthResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: terminal.IAuthResponse);

        /** AuthResponse ok. */
        public ok: boolean;

        /** AuthResponse error. */
        public error: string;

        /** AuthResponse isAdminActive. */
        public isAdminActive: boolean;

        /** AuthResponse isScreenActive. */
        public isScreenActive: boolean;

        /**
         * Creates a new AuthResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AuthResponse instance
         */
        public static create(properties?: terminal.IAuthResponse): terminal.AuthResponse;

        /**
         * Encodes the specified AuthResponse message. Does not implicitly {@link terminal.AuthResponse.verify|verify} messages.
         * @param message AuthResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: terminal.IAuthResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AuthResponse message, length delimited. Does not implicitly {@link terminal.AuthResponse.verify|verify} messages.
         * @param message AuthResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: terminal.IAuthResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AuthResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AuthResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): terminal.AuthResponse;

        /**
         * Decodes an AuthResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AuthResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): terminal.AuthResponse;

        /**
         * Verifies an AuthResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AuthResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AuthResponse
         */
        public static fromObject(object: { [k: string]: any }): terminal.AuthResponse;

        /**
         * Creates a plain object from an AuthResponse message. Also converts values to other types if specified.
         * @param message AuthResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: terminal.AuthResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AuthResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for AuthResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a RegisterHostRequest. */
    interface IRegisterHostRequest {

        /** RegisterHostRequest hostId */
        hostId?: (string|null);

        /** RegisterHostRequest password */
        password?: (string|null);

        /** RegisterHostRequest hwid */
        hwid?: (string|null);

        /** RegisterHostRequest ip */
        ip?: (string|null);

        /** RegisterHostRequest runAsAdmin */
        runAsAdmin?: (boolean|null);
    }

    /** Represents a RegisterHostRequest. */
    class RegisterHostRequest implements IRegisterHostRequest {

        /**
         * Constructs a new RegisterHostRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: terminal.IRegisterHostRequest);

        /** RegisterHostRequest hostId. */
        public hostId: string;

        /** RegisterHostRequest password. */
        public password: string;

        /** RegisterHostRequest hwid. */
        public hwid: string;

        /** RegisterHostRequest ip. */
        public ip: string;

        /** RegisterHostRequest runAsAdmin. */
        public runAsAdmin: boolean;

        /**
         * Creates a new RegisterHostRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RegisterHostRequest instance
         */
        public static create(properties?: terminal.IRegisterHostRequest): terminal.RegisterHostRequest;

        /**
         * Encodes the specified RegisterHostRequest message. Does not implicitly {@link terminal.RegisterHostRequest.verify|verify} messages.
         * @param message RegisterHostRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: terminal.IRegisterHostRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RegisterHostRequest message, length delimited. Does not implicitly {@link terminal.RegisterHostRequest.verify|verify} messages.
         * @param message RegisterHostRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: terminal.IRegisterHostRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RegisterHostRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RegisterHostRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): terminal.RegisterHostRequest;

        /**
         * Decodes a RegisterHostRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RegisterHostRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): terminal.RegisterHostRequest;

        /**
         * Verifies a RegisterHostRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RegisterHostRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RegisterHostRequest
         */
        public static fromObject(object: { [k: string]: any }): terminal.RegisterHostRequest;

        /**
         * Creates a plain object from a RegisterHostRequest message. Also converts values to other types if specified.
         * @param message RegisterHostRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: terminal.RegisterHostRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RegisterHostRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for RegisterHostRequest
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a RegisterHostResponse. */
    interface IRegisterHostResponse {

        /** RegisterHostResponse ok */
        ok?: (boolean|null);

        /** RegisterHostResponse token */
        token?: (string|null);

        /** RegisterHostResponse error */
        error?: (string|null);

        /** RegisterHostResponse isAdmin */
        isAdmin?: (boolean|null);
    }

    /** Represents a RegisterHostResponse. */
    class RegisterHostResponse implements IRegisterHostResponse {

        /**
         * Constructs a new RegisterHostResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: terminal.IRegisterHostResponse);

        /** RegisterHostResponse ok. */
        public ok: boolean;

        /** RegisterHostResponse token. */
        public token: string;

        /** RegisterHostResponse error. */
        public error: string;

        /** RegisterHostResponse isAdmin. */
        public isAdmin: boolean;

        /**
         * Creates a new RegisterHostResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RegisterHostResponse instance
         */
        public static create(properties?: terminal.IRegisterHostResponse): terminal.RegisterHostResponse;

        /**
         * Encodes the specified RegisterHostResponse message. Does not implicitly {@link terminal.RegisterHostResponse.verify|verify} messages.
         * @param message RegisterHostResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: terminal.IRegisterHostResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RegisterHostResponse message, length delimited. Does not implicitly {@link terminal.RegisterHostResponse.verify|verify} messages.
         * @param message RegisterHostResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: terminal.IRegisterHostResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RegisterHostResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RegisterHostResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): terminal.RegisterHostResponse;

        /**
         * Decodes a RegisterHostResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RegisterHostResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): terminal.RegisterHostResponse;

        /**
         * Verifies a RegisterHostResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RegisterHostResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RegisterHostResponse
         */
        public static fromObject(object: { [k: string]: any }): terminal.RegisterHostResponse;

        /**
         * Creates a plain object from a RegisterHostResponse message. Also converts values to other types if specified.
         * @param message RegisterHostResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: terminal.RegisterHostResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RegisterHostResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for RegisterHostResponse
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PtyInput. */
    interface IPtyInput {

        /** PtyInput data */
        data?: (string|null);
    }

    /** Represents a PtyInput. */
    class PtyInput implements IPtyInput {

        /**
         * Constructs a new PtyInput.
         * @param [properties] Properties to set
         */
        constructor(properties?: terminal.IPtyInput);

        /** PtyInput data. */
        public data: string;

        /**
         * Creates a new PtyInput instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PtyInput instance
         */
        public static create(properties?: terminal.IPtyInput): terminal.PtyInput;

        /**
         * Encodes the specified PtyInput message. Does not implicitly {@link terminal.PtyInput.verify|verify} messages.
         * @param message PtyInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: terminal.IPtyInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PtyInput message, length delimited. Does not implicitly {@link terminal.PtyInput.verify|verify} messages.
         * @param message PtyInput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: terminal.IPtyInput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PtyInput message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PtyInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): terminal.PtyInput;

        /**
         * Decodes a PtyInput message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PtyInput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): terminal.PtyInput;

        /**
         * Verifies a PtyInput message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PtyInput message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PtyInput
         */
        public static fromObject(object: { [k: string]: any }): terminal.PtyInput;

        /**
         * Creates a plain object from a PtyInput message. Also converts values to other types if specified.
         * @param message PtyInput
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: terminal.PtyInput, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PtyInput to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PtyInput
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PtyResize. */
    interface IPtyResize {

        /** PtyResize cols */
        cols?: (number|null);

        /** PtyResize rows */
        rows?: (number|null);
    }

    /** Represents a PtyResize. */
    class PtyResize implements IPtyResize {

        /**
         * Constructs a new PtyResize.
         * @param [properties] Properties to set
         */
        constructor(properties?: terminal.IPtyResize);

        /** PtyResize cols. */
        public cols: number;

        /** PtyResize rows. */
        public rows: number;

        /**
         * Creates a new PtyResize instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PtyResize instance
         */
        public static create(properties?: terminal.IPtyResize): terminal.PtyResize;

        /**
         * Encodes the specified PtyResize message. Does not implicitly {@link terminal.PtyResize.verify|verify} messages.
         * @param message PtyResize message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: terminal.IPtyResize, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PtyResize message, length delimited. Does not implicitly {@link terminal.PtyResize.verify|verify} messages.
         * @param message PtyResize message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: terminal.IPtyResize, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PtyResize message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PtyResize
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): terminal.PtyResize;

        /**
         * Decodes a PtyResize message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PtyResize
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): terminal.PtyResize;

        /**
         * Verifies a PtyResize message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PtyResize message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PtyResize
         */
        public static fromObject(object: { [k: string]: any }): terminal.PtyResize;

        /**
         * Creates a plain object from a PtyResize message. Also converts values to other types if specified.
         * @param message PtyResize
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: terminal.PtyResize, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PtyResize to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PtyResize
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PtyOutput. */
    interface IPtyOutput {

        /** PtyOutput data */
        data?: (string|null);

        /** PtyOutput clientId */
        clientId?: (string|null);
    }

    /** Represents a PtyOutput. */
    class PtyOutput implements IPtyOutput {

        /**
         * Constructs a new PtyOutput.
         * @param [properties] Properties to set
         */
        constructor(properties?: terminal.IPtyOutput);

        /** PtyOutput data. */
        public data: string;

        /** PtyOutput clientId. */
        public clientId: string;

        /**
         * Creates a new PtyOutput instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PtyOutput instance
         */
        public static create(properties?: terminal.IPtyOutput): terminal.PtyOutput;

        /**
         * Encodes the specified PtyOutput message. Does not implicitly {@link terminal.PtyOutput.verify|verify} messages.
         * @param message PtyOutput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: terminal.IPtyOutput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PtyOutput message, length delimited. Does not implicitly {@link terminal.PtyOutput.verify|verify} messages.
         * @param message PtyOutput message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: terminal.IPtyOutput, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PtyOutput message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PtyOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): terminal.PtyOutput;

        /**
         * Decodes a PtyOutput message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PtyOutput
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): terminal.PtyOutput;

        /**
         * Verifies a PtyOutput message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PtyOutput message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PtyOutput
         */
        public static fromObject(object: { [k: string]: any }): terminal.PtyOutput;

        /**
         * Creates a plain object from a PtyOutput message. Also converts values to other types if specified.
         * @param message PtyOutput
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: terminal.PtyOutput, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PtyOutput to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PtyOutput
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a PtyExit. */
    interface IPtyExit {

        /** PtyExit code */
        code?: (number|null);

        /** PtyExit clientId */
        clientId?: (string|null);
    }

    /** Represents a PtyExit. */
    class PtyExit implements IPtyExit {

        /**
         * Constructs a new PtyExit.
         * @param [properties] Properties to set
         */
        constructor(properties?: terminal.IPtyExit);

        /** PtyExit code. */
        public code: number;

        /** PtyExit clientId. */
        public clientId: string;

        /**
         * Creates a new PtyExit instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PtyExit instance
         */
        public static create(properties?: terminal.IPtyExit): terminal.PtyExit;

        /**
         * Encodes the specified PtyExit message. Does not implicitly {@link terminal.PtyExit.verify|verify} messages.
         * @param message PtyExit message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: terminal.IPtyExit, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PtyExit message, length delimited. Does not implicitly {@link terminal.PtyExit.verify|verify} messages.
         * @param message PtyExit message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: terminal.IPtyExit, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PtyExit message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PtyExit
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): terminal.PtyExit;

        /**
         * Decodes a PtyExit message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PtyExit
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): terminal.PtyExit;

        /**
         * Verifies a PtyExit message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PtyExit message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PtyExit
         */
        public static fromObject(object: { [k: string]: any }): terminal.PtyExit;

        /**
         * Creates a plain object from a PtyExit message. Also converts values to other types if specified.
         * @param message PtyExit
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: terminal.PtyExit, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PtyExit to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for PtyExit
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SystemMessage. */
    interface ISystemMessage {

        /** SystemMessage message */
        message?: (string|null);
    }

    /** Represents a SystemMessage. */
    class SystemMessage implements ISystemMessage {

        /**
         * Constructs a new SystemMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: terminal.ISystemMessage);

        /** SystemMessage message. */
        public message: string;

        /**
         * Creates a new SystemMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SystemMessage instance
         */
        public static create(properties?: terminal.ISystemMessage): terminal.SystemMessage;

        /**
         * Encodes the specified SystemMessage message. Does not implicitly {@link terminal.SystemMessage.verify|verify} messages.
         * @param message SystemMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: terminal.ISystemMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SystemMessage message, length delimited. Does not implicitly {@link terminal.SystemMessage.verify|verify} messages.
         * @param message SystemMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: terminal.ISystemMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SystemMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SystemMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): terminal.SystemMessage;

        /**
         * Decodes a SystemMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SystemMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): terminal.SystemMessage;

        /**
         * Verifies a SystemMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SystemMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SystemMessage
         */
        public static fromObject(object: { [k: string]: any }): terminal.SystemMessage;

        /**
         * Creates a plain object from a SystemMessage message. Also converts values to other types if specified.
         * @param message SystemMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: terminal.SystemMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SystemMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SystemMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of an ErrorMessage. */
    interface IErrorMessage {

        /** ErrorMessage message */
        message?: (string|null);
    }

    /** Represents an ErrorMessage. */
    class ErrorMessage implements IErrorMessage {

        /**
         * Constructs a new ErrorMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: terminal.IErrorMessage);

        /** ErrorMessage message. */
        public message: string;

        /**
         * Creates a new ErrorMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ErrorMessage instance
         */
        public static create(properties?: terminal.IErrorMessage): terminal.ErrorMessage;

        /**
         * Encodes the specified ErrorMessage message. Does not implicitly {@link terminal.ErrorMessage.verify|verify} messages.
         * @param message ErrorMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: terminal.IErrorMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ErrorMessage message, length delimited. Does not implicitly {@link terminal.ErrorMessage.verify|verify} messages.
         * @param message ErrorMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: terminal.IErrorMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ErrorMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ErrorMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): terminal.ErrorMessage;

        /**
         * Decodes an ErrorMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ErrorMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): terminal.ErrorMessage;

        /**
         * Verifies an ErrorMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ErrorMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ErrorMessage
         */
        public static fromObject(object: { [k: string]: any }): terminal.ErrorMessage;

        /**
         * Creates a plain object from an ErrorMessage message. Also converts values to other types if specified.
         * @param message ErrorMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: terminal.ErrorMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ErrorMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ErrorMessage
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ScreenFrame. */
    interface IScreenFrame {

        /** ScreenFrame data */
        data?: (Uint8Array|null);

        /** ScreenFrame width */
        width?: (number|null);

        /** ScreenFrame height */
        height?: (number|null);
    }

    /** Represents a ScreenFrame. */
    class ScreenFrame implements IScreenFrame {

        /**
         * Constructs a new ScreenFrame.
         * @param [properties] Properties to set
         */
        constructor(properties?: terminal.IScreenFrame);

        /** ScreenFrame data. */
        public data: Uint8Array;

        /** ScreenFrame width. */
        public width: number;

        /** ScreenFrame height. */
        public height: number;

        /**
         * Creates a new ScreenFrame instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ScreenFrame instance
         */
        public static create(properties?: terminal.IScreenFrame): terminal.ScreenFrame;

        /**
         * Encodes the specified ScreenFrame message. Does not implicitly {@link terminal.ScreenFrame.verify|verify} messages.
         * @param message ScreenFrame message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: terminal.IScreenFrame, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ScreenFrame message, length delimited. Does not implicitly {@link terminal.ScreenFrame.verify|verify} messages.
         * @param message ScreenFrame message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: terminal.IScreenFrame, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ScreenFrame message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ScreenFrame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): terminal.ScreenFrame;

        /**
         * Decodes a ScreenFrame message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ScreenFrame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): terminal.ScreenFrame;

        /**
         * Verifies a ScreenFrame message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ScreenFrame message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ScreenFrame
         */
        public static fromObject(object: { [k: string]: any }): terminal.ScreenFrame;

        /**
         * Creates a plain object from a ScreenFrame message. Also converts values to other types if specified.
         * @param message ScreenFrame
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: terminal.ScreenFrame, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ScreenFrame to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ScreenFrame
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ToggleScreenStatus. */
    interface IToggleScreenStatus {

        /** ToggleScreenStatus enabled */
        enabled?: (boolean|null);
    }

    /** Represents a ToggleScreenStatus. */
    class ToggleScreenStatus implements IToggleScreenStatus {

        /**
         * Constructs a new ToggleScreenStatus.
         * @param [properties] Properties to set
         */
        constructor(properties?: terminal.IToggleScreenStatus);

        /** ToggleScreenStatus enabled. */
        public enabled: boolean;

        /**
         * Creates a new ToggleScreenStatus instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ToggleScreenStatus instance
         */
        public static create(properties?: terminal.IToggleScreenStatus): terminal.ToggleScreenStatus;

        /**
         * Encodes the specified ToggleScreenStatus message. Does not implicitly {@link terminal.ToggleScreenStatus.verify|verify} messages.
         * @param message ToggleScreenStatus message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: terminal.IToggleScreenStatus, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ToggleScreenStatus message, length delimited. Does not implicitly {@link terminal.ToggleScreenStatus.verify|verify} messages.
         * @param message ToggleScreenStatus message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: terminal.IToggleScreenStatus, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ToggleScreenStatus message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ToggleScreenStatus
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): terminal.ToggleScreenStatus;

        /**
         * Decodes a ToggleScreenStatus message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ToggleScreenStatus
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): terminal.ToggleScreenStatus;

        /**
         * Verifies a ToggleScreenStatus message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ToggleScreenStatus message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ToggleScreenStatus
         */
        public static fromObject(object: { [k: string]: any }): terminal.ToggleScreenStatus;

        /**
         * Creates a plain object from a ToggleScreenStatus message. Also converts values to other types if specified.
         * @param message ToggleScreenStatus
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: terminal.ToggleScreenStatus, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ToggleScreenStatus to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ToggleScreenStatus
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a ToggleAdminStatus. */
    interface IToggleAdminStatus {

        /** ToggleAdminStatus enabled */
        enabled?: (boolean|null);
    }

    /** Represents a ToggleAdminStatus. */
    class ToggleAdminStatus implements IToggleAdminStatus {

        /**
         * Constructs a new ToggleAdminStatus.
         * @param [properties] Properties to set
         */
        constructor(properties?: terminal.IToggleAdminStatus);

        /** ToggleAdminStatus enabled. */
        public enabled: boolean;

        /**
         * Creates a new ToggleAdminStatus instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ToggleAdminStatus instance
         */
        public static create(properties?: terminal.IToggleAdminStatus): terminal.ToggleAdminStatus;

        /**
         * Encodes the specified ToggleAdminStatus message. Does not implicitly {@link terminal.ToggleAdminStatus.verify|verify} messages.
         * @param message ToggleAdminStatus message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: terminal.IToggleAdminStatus, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ToggleAdminStatus message, length delimited. Does not implicitly {@link terminal.ToggleAdminStatus.verify|verify} messages.
         * @param message ToggleAdminStatus message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: terminal.IToggleAdminStatus, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ToggleAdminStatus message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ToggleAdminStatus
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): terminal.ToggleAdminStatus;

        /**
         * Decodes a ToggleAdminStatus message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ToggleAdminStatus
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): terminal.ToggleAdminStatus;

        /**
         * Verifies a ToggleAdminStatus message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ToggleAdminStatus message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ToggleAdminStatus
         */
        public static fromObject(object: { [k: string]: any }): terminal.ToggleAdminStatus;

        /**
         * Creates a plain object from a ToggleAdminStatus message. Also converts values to other types if specified.
         * @param message ToggleAdminStatus
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: terminal.ToggleAdminStatus, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ToggleAdminStatus to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for ToggleAdminStatus
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a HostCapabilities. */
    interface IHostCapabilities {

        /** HostCapabilities supportsScreenShare */
        supportsScreenShare?: (boolean|null);

        /** HostCapabilities supportsAdminMode */
        supportsAdminMode?: (boolean|null);

        /** HostCapabilities isAdmin */
        isAdmin?: (boolean|null);
    }

    /** Represents a HostCapabilities. */
    class HostCapabilities implements IHostCapabilities {

        /**
         * Constructs a new HostCapabilities.
         * @param [properties] Properties to set
         */
        constructor(properties?: terminal.IHostCapabilities);

        /** HostCapabilities supportsScreenShare. */
        public supportsScreenShare: boolean;

        /** HostCapabilities supportsAdminMode. */
        public supportsAdminMode: boolean;

        /** HostCapabilities isAdmin. */
        public isAdmin: boolean;

        /**
         * Creates a new HostCapabilities instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HostCapabilities instance
         */
        public static create(properties?: terminal.IHostCapabilities): terminal.HostCapabilities;

        /**
         * Encodes the specified HostCapabilities message. Does not implicitly {@link terminal.HostCapabilities.verify|verify} messages.
         * @param message HostCapabilities message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: terminal.IHostCapabilities, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HostCapabilities message, length delimited. Does not implicitly {@link terminal.HostCapabilities.verify|verify} messages.
         * @param message HostCapabilities message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: terminal.IHostCapabilities, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HostCapabilities message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HostCapabilities
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): terminal.HostCapabilities;

        /**
         * Decodes a HostCapabilities message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HostCapabilities
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): terminal.HostCapabilities;

        /**
         * Verifies a HostCapabilities message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HostCapabilities message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HostCapabilities
         */
        public static fromObject(object: { [k: string]: any }): terminal.HostCapabilities;

        /**
         * Creates a plain object from a HostCapabilities message. Also converts values to other types if specified.
         * @param message HostCapabilities
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: terminal.HostCapabilities, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HostCapabilities to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for HostCapabilities
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
