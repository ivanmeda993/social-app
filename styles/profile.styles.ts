// styles/profile.styles.ts
import { COLORS } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginLeft: 16,
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
  },
  profileInfo: {
    padding: 16,
  },
  avatarAndStats: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  statsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.grey,
    marginTop: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    paddingVertical: 8,
    alignItems: "center",
    marginRight: 8,
  },
  editButtonText: {
    color: COLORS.white,
    fontWeight: "500",
  },
  shareButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  postsGrid: {
    marginTop: 8,
  },
  gridItem: {
    padding: 2,
    aspectRatio: 1,
  },
  gridImage: {
    flex: 1,
    borderRadius: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "600",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: COLORS.grey,
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    color: COLORS.white,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 20,
  },
  saveButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "600",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
  },
  postDetailContainer: {
    backgroundColor: COLORS.background,
    maxHeight: height * 0.9,
  },
  postDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surface,
  },
  postDetailImage: {
    width: width,
    height: width,
  },
  followButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 16,
  },
  followingButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  followButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  followingButtonText: {
    color: COLORS.white,
    textAlign: "center",
  },
  noPostsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 12,
    flex: 1,
  },
  noPostsText: {
    color: COLORS.grey,
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
  },
});
