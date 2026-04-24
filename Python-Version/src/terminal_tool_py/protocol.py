from google.protobuf import descriptor_pb2, descriptor_pool, message_factory


def _add_field(
    message: descriptor_pb2.DescriptorProto,
    *,
    name: str,
    number: int,
    field_type: int,
    label: int = descriptor_pb2.FieldDescriptorProto.LABEL_OPTIONAL,
    type_name: str | None = None,
    oneof_index: int | None = None,
) -> None:
    field = message.field.add()
    field.name = name
    field.number = number
    field.label = label
    field.type = field_type
    if type_name:
        field.type_name = type_name
    if oneof_index is not None:
        field.oneof_index = oneof_index


def _build_file_descriptor() -> descriptor_pb2.FileDescriptorProto:
    file_descriptor = descriptor_pb2.FileDescriptorProto()
    file_descriptor.name = "terminal.proto"
    file_descriptor.package = "terminal"
    file_descriptor.syntax = "proto3"

    def add_message(name: str) -> descriptor_pb2.DescriptorProto:
        message = file_descriptor.message_type.add()
        message.name = name
        return message

    client_message = add_message("ClientMessage")
    client_oneof = client_message.oneof_decl.add()
    client_oneof.name = "payload"
    _add_field(
        client_message,
        name="auth_request",
        number=1,
        field_type=descriptor_pb2.FieldDescriptorProto.TYPE_MESSAGE,
        type_name=".terminal.AuthRequest",
        oneof_index=0,
    )
    _add_field(
        client_message,
        name="register_host",
        number=2,
        field_type=descriptor_pb2.FieldDescriptorProto.TYPE_MESSAGE,
        type_name=".terminal.RegisterHostRequest",
        oneof_index=0,
    )
    _add_field(
        client_message,
        name="pty_input",
        number=3,
        field_type=descriptor_pb2.FieldDescriptorProto.TYPE_MESSAGE,
        type_name=".terminal.PtyInput",
        oneof_index=0,
    )
    _add_field(
        client_message,
        name="pty_resize",
        number=4,
        field_type=descriptor_pb2.FieldDescriptorProto.TYPE_MESSAGE,
        type_name=".terminal.PtyResize",
        oneof_index=0,
    )
    _add_field(
        client_message,
        name="client_id",
        number=10,
        field_type=descriptor_pb2.FieldDescriptorProto.TYPE_STRING,
    )

    server_message = add_message("ServerMessage")
    server_oneof = server_message.oneof_decl.add()
    server_oneof.name = "payload"
    _add_field(
        server_message,
        name="auth_response",
        number=1,
        field_type=descriptor_pb2.FieldDescriptorProto.TYPE_MESSAGE,
        type_name=".terminal.AuthResponse",
        oneof_index=0,
    )
    _add_field(
        server_message,
        name="register_host_response",
        number=2,
        field_type=descriptor_pb2.FieldDescriptorProto.TYPE_MESSAGE,
        type_name=".terminal.RegisterHostResponse",
        oneof_index=0,
    )
    _add_field(
        server_message,
        name="pty_output",
        number=3,
        field_type=descriptor_pb2.FieldDescriptorProto.TYPE_MESSAGE,
        type_name=".terminal.PtyOutput",
        oneof_index=0,
    )
    _add_field(
        server_message,
        name="pty_exit",
        number=4,
        field_type=descriptor_pb2.FieldDescriptorProto.TYPE_MESSAGE,
        type_name=".terminal.PtyExit",
        oneof_index=0,
    )
    _add_field(
        server_message,
        name="system_message",
        number=5,
        field_type=descriptor_pb2.FieldDescriptorProto.TYPE_MESSAGE,
        type_name=".terminal.SystemMessage",
        oneof_index=0,
    )
    _add_field(
        server_message,
        name="error_message",
        number=6,
        field_type=descriptor_pb2.FieldDescriptorProto.TYPE_MESSAGE,
        type_name=".terminal.ErrorMessage",
        oneof_index=0,
    )

    host_message = add_message("HostMessage")
    host_oneof = host_message.oneof_decl.add()
    host_oneof.name = "payload"
    _add_field(
        host_message,
        name="auth_request",
        number=1,
        field_type=descriptor_pb2.FieldDescriptorProto.TYPE_MESSAGE,
        type_name=".terminal.AuthRequest",
        oneof_index=0,
    )
    _add_field(
        host_message,
        name="register_host",
        number=2,
        field_type=descriptor_pb2.FieldDescriptorProto.TYPE_MESSAGE,
        type_name=".terminal.RegisterHostRequest",
        oneof_index=0,
    )
    _add_field(
        host_message,
        name="pty_output",
        number=3,
        field_type=descriptor_pb2.FieldDescriptorProto.TYPE_MESSAGE,
        type_name=".terminal.PtyOutput",
        oneof_index=0,
    )
    _add_field(
        host_message,
        name="pty_exit",
        number=4,
        field_type=descriptor_pb2.FieldDescriptorProto.TYPE_MESSAGE,
        type_name=".terminal.PtyExit",
        oneof_index=0,
    )

    auth_request = add_message("AuthRequest")
    _add_field(auth_request, name="host_id", number=1, field_type=descriptor_pb2.FieldDescriptorProto.TYPE_STRING)
    _add_field(auth_request, name="token", number=2, field_type=descriptor_pb2.FieldDescriptorProto.TYPE_STRING)

    auth_response = add_message("AuthResponse")
    _add_field(auth_response, name="ok", number=1, field_type=descriptor_pb2.FieldDescriptorProto.TYPE_BOOL)
    _add_field(auth_response, name="error", number=2, field_type=descriptor_pb2.FieldDescriptorProto.TYPE_STRING)

    register_host_request = add_message("RegisterHostRequest")
    _add_field(
        register_host_request,
        name="host_id",
        number=1,
        field_type=descriptor_pb2.FieldDescriptorProto.TYPE_STRING,
    )
    _add_field(
        register_host_request,
        name="password",
        number=2,
        field_type=descriptor_pb2.FieldDescriptorProto.TYPE_STRING,
    )

    register_host_response = add_message("RegisterHostResponse")
    _add_field(register_host_response, name="ok", number=1, field_type=descriptor_pb2.FieldDescriptorProto.TYPE_BOOL)
    _add_field(register_host_response, name="token", number=2, field_type=descriptor_pb2.FieldDescriptorProto.TYPE_STRING)
    _add_field(register_host_response, name="error", number=3, field_type=descriptor_pb2.FieldDescriptorProto.TYPE_STRING)

    pty_input = add_message("PtyInput")
    _add_field(pty_input, name="data", number=1, field_type=descriptor_pb2.FieldDescriptorProto.TYPE_STRING)

    pty_resize = add_message("PtyResize")
    _add_field(pty_resize, name="cols", number=1, field_type=descriptor_pb2.FieldDescriptorProto.TYPE_UINT32)
    _add_field(pty_resize, name="rows", number=2, field_type=descriptor_pb2.FieldDescriptorProto.TYPE_UINT32)

    pty_output = add_message("PtyOutput")
    _add_field(pty_output, name="data", number=1, field_type=descriptor_pb2.FieldDescriptorProto.TYPE_STRING)
    _add_field(pty_output, name="client_id", number=2, field_type=descriptor_pb2.FieldDescriptorProto.TYPE_STRING)

    pty_exit = add_message("PtyExit")
    _add_field(pty_exit, name="code", number=1, field_type=descriptor_pb2.FieldDescriptorProto.TYPE_INT32)
    _add_field(pty_exit, name="client_id", number=2, field_type=descriptor_pb2.FieldDescriptorProto.TYPE_STRING)

    system_message = add_message("SystemMessage")
    _add_field(system_message, name="message", number=1, field_type=descriptor_pb2.FieldDescriptorProto.TYPE_STRING)

    error_message = add_message("ErrorMessage")
    _add_field(error_message, name="message", number=1, field_type=descriptor_pb2.FieldDescriptorProto.TYPE_STRING)

    return file_descriptor


POOL = descriptor_pool.DescriptorPool()
POOL.Add(_build_file_descriptor())

ClientMessage = message_factory.GetMessageClass(POOL.FindMessageTypeByName("terminal.ClientMessage"))
ServerMessage = message_factory.GetMessageClass(POOL.FindMessageTypeByName("terminal.ServerMessage"))
HostMessage = message_factory.GetMessageClass(POOL.FindMessageTypeByName("terminal.HostMessage"))
AuthRequest = message_factory.GetMessageClass(POOL.FindMessageTypeByName("terminal.AuthRequest"))
AuthResponse = message_factory.GetMessageClass(POOL.FindMessageTypeByName("terminal.AuthResponse"))
RegisterHostRequest = message_factory.GetMessageClass(
    POOL.FindMessageTypeByName("terminal.RegisterHostRequest")
)
RegisterHostResponse = message_factory.GetMessageClass(
    POOL.FindMessageTypeByName("terminal.RegisterHostResponse")
)
PtyInput = message_factory.GetMessageClass(POOL.FindMessageTypeByName("terminal.PtyInput"))
PtyResize = message_factory.GetMessageClass(POOL.FindMessageTypeByName("terminal.PtyResize"))
PtyOutput = message_factory.GetMessageClass(POOL.FindMessageTypeByName("terminal.PtyOutput"))
PtyExit = message_factory.GetMessageClass(POOL.FindMessageTypeByName("terminal.PtyExit"))
SystemMessage = message_factory.GetMessageClass(POOL.FindMessageTypeByName("terminal.SystemMessage"))
ErrorMessage = message_factory.GetMessageClass(POOL.FindMessageTypeByName("terminal.ErrorMessage"))
